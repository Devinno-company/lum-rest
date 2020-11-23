import NewEvent from "../interfaces/request/NewEvent";
import EventResponse from "../interfaces/response/EventResponse";
import TeamMember from "../interfaces/response/TeamMember";
import UpdateEvent from "../interfaces/request/UpdateEventRequest";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import CategoryRepository from "../repositorys/CategoryRepository";
import CityRepository from "../repositorys/CityRepository";
import EventRepository from "../repositorys/EventRepository";
import GeolocationRepository from "../repositorys/GeolocationRepository";
import LocationEventRepository from "../repositorys/LocationEventRepository";
import PrivacyRepository from "../repositorys/PrivacyRepository";
import RoleRepository from "../repositorys/RoleRepository";
import UserRepository from "../repositorys/UserRepository";
import TaskRepository from "../repositorys/TaskRepository";
import TimeRepository from "../repositorys/TimeRepository";
import NoticeRepository from "../repositorys/NoticeRepository";
import MaterialRepository from "../repositorys/MaterialRepository";
import havePermission from "../utils/havePermission";
import LinkMercadoPagoRepository from "../repositorys/LinkMercadoPagoRepository";
import Axios from "axios";
import updateLinkMercadoPago from "../interfaces/inputRepository/updateLinkMercadoPago";
import s3 from "../aws/S3";
import { DeleteObjectRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import genNameFile from "../utils/genNameFile";
import TicketRepository from "../repositorys/TicketRepository";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import InviteRepository from "../repositorys/InviteRepository";
import MessageRepository from "../repositorys/MessageRepository";
import RoomRepository from "../repositorys/RoomRepository";
import Event from "../models/Event";
import LocationUserRepository from "../repositorys/LocationUserRepository";
import haversine from "../utils/haversine";
import jwt from 'jsonwebtoken';

class EventController {

    public insertEvent(newEvent: NewEvent, user: User) {

        return new Promise(async (resolve, reject) => {

            const insertedGeolocation = await GeolocationRepository.insertGeolocation({
                latitude: newEvent.location.geolocation.latitude,
                longitude: newEvent.location.geolocation.longitude
            }).catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));

            const city = await CityRepository.findCityByNameAndUf(newEvent.location.city, newEvent.location.uf);
            const category = await CategoryRepository.findCategoryById(newEvent.category);

            if (!category) {
                reject({ status: 400, message: "This category doesn't exist" });
            };
            if (!city) {
                reject({ status: 400, message: "This city doesn't exist" });
            } else if (insertedGeolocation) {

                const insertedLocationEvent = await LocationEventRepository.insertLocationEvent({
                    street: newEvent.location.street,
                    neighborhood: newEvent.location.neighborhood,
                    cep: newEvent.location.cep,
                    number: newEvent.location.number,
                    complement: newEvent.location.complement
                }, insertedGeolocation.cd_geolocation, city.cd_city)
                    .catch(err => reject(err));

                if (insertedLocationEvent) {

                    const insertedEvent = await EventRepository.insertEvent({
                        name: newEvent.name,
                        description: newEvent.description,
                        start_date: newEvent.start_date,
                        end_date: newEvent.end_date,
                        start_time: newEvent.start_time,
                        end_time: newEvent.end_time,
                        type: newEvent.type
                    }, newEvent.privacy, newEvent.category, insertedLocationEvent.cd_location_event)
                        .catch(err => {
                            LocationEventRepository.deleteLocationEventById(insertedLocationEvent.cd_location_event);
                            reject({ status: 400, message: 'Unknown error. Try again later.', err })
                        });

                    if (insertedEvent) {
                        AccessRepository
                            .insertAccess(user.cd_user, insertedEvent.cd_event, 'CRI')
                            .then(async () => resolve(await this.readEvent(insertedEvent.cd_event, user)))
                            .catch(async (err) => {
                                // Delete previous inserts 
                                await EventRepository.deleteEventById(insertedEvent.cd_event);
                                await LocationEventRepository.deleteLocationEventById(insertedLocationEvent.cd_location_event);
                                await GeolocationRepository.deleteGeolocation(insertedGeolocation.cd_geolocation);

                                reject({ status: 400, message: 'Unknown error. Try again later.', err })
                            });
                    }
                }
            }
        });
    }

    async updateEvent(user: User, updateEvent: UpdateEvent, idEvent: number): Promise<EventResponse> {

        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(updateEvent) === '{}') {
                reject({ status: 400, message: 'No field to update' });
            } else {
                const event = await EventRepository.findEventById(idEvent);
                let location: any = undefined;
                /* If don't need to make updates to the location */
                if ((!updateEvent.location_to) && event.cd_location_event) {
                    location = await LocationEventRepository.findLocationEventById(event.cd_location_event);

                    /* If just need to update localization */
                } else if (updateEvent.location_to && event.cd_location_event) {

                    const locationEvent = await LocationEventRepository.findLocationEventById(event.cd_location_event);
                    const searchCity = await CityRepository.findCityByNameAndUf(updateEvent.location_to.city, updateEvent.location_to.uf)

                    if (!searchCity)
                        reject({ status: 400, message: "This city does not exist" });
                    else {
                        await GeolocationRepository.updateGeolocation(locationEvent.cd_geolocation, updateEvent.location_to.geolocation)
                            .catch(err => { reject({ status: 400, message: "Unknown error. Try again later.", error: err }) });

                        await LocationEventRepository.updateLocationEvent(event.cd_location_event, updateEvent.location_to);

                        location = await LocationEventRepository.updateCityEvent(event.cd_location_event, searchCity.cd_city);
                    }
                    /* If need to insert a new localization */
                } else if (updateEvent.location_to && !event.cd_location_event) {

                    if (!updateEvent.location_to.city || !updateEvent.location_to.geolocation || !updateEvent.location_to.uf)
                        reject({ message: "City, uf and geolocation are required", status: 400 });
                    else {
                        const insertedGeolocation =
                            await GeolocationRepository.insertGeolocation(updateEvent.location_to.geolocation)
                                .catch(err => reject({ status: 400, message: 'Unknown error. Try again later', error: err }));

                        const searchCity = await CityRepository.findCityByNameAndUf(updateEvent.location_to.city, updateEvent.location_to.uf)

                        if (!searchCity)
                            reject({ status: 400, message: 'This city does not exist' });
                        else if (insertedGeolocation) {
                            let locationParams = { street: updateEvent.location_to.street_to, neighborhood: updateEvent.location_to.street_to, number: updateEvent.location_to.number_to, cep: String(updateEvent.location_to.cep_to), complement: updateEvent.location_to.complement_to };
                            await LocationEventRepository.insertLocationEvent(locationParams, insertedGeolocation.cd_geolocation, searchCity.cd_city)
                                .then((locationEvent) => {
                                    EventRepository.updateLocationEvent(event.cd_event, locationEvent.cd_location_event);
                                })
                                .catch((err) => {
                                    GeolocationRepository.deleteGeolocation(insertedGeolocation.cd_geolocation);
                                    reject({ status: 400, message: 'Unknown error. Try again later', error: err });
                                });
                        }
                    }
                }
                EventRepository.updateEvent(event.cd_event, updateEvent)
                    .then(async (event) =>
                        resolve(await this.readEvent(event.cd_event, user)))
                    .catch(err => reject(err));
            }
        });
    }

    async deleteEvent(user: User, idEvent: number) {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);
            if (!event) {
                reject({ status: 404, message: "This event doesn't exists" });
            } else {
                const access = await AccessRepository.findAccessByEventIdAndUserId(event.cd_event, user.cd_user);
                if (!access)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else if (access.sg_role != 'CRI') {
                    reject({ status: 401, message: "You are not allowed to do so" })
                }
                else {
                    /* Deleta todos bilhetes(tickets) relacionados ao evento */
                    const tickets = await TicketRepository.findTicketsByEventId(event.cd_event);
                    if (tickets) {
                        tickets.map(item => {
                            if (PurchaseRepository.findPurchasesByTicketId(item.cd_ticket)) {
                                reject({ status: 403, message: "You can't delete events that already have purchases." });
                            }
                        });
                        tickets.map(async item => {
                            await TicketRepository.deleteTicketById(item.cd_ticket)
                        });
                    }
                    /* Deleta todas tasks relacionadas ao evento */
                    const tasks = await TaskRepository.findTaskByEventId(event.cd_event);
                    if (tasks) {
                        tasks.map(async item => {
                            await TaskRepository.deleteTaskById(item.cd_task)
                        });
                    }
                    /* Deleta todos tempos(times) relacionados ao evento */
                    const times = await TimeRepository.findTimeByEventId(event.cd_event);
                    if (times) {
                        times.map(async item => {
                            await TimeRepository.deleteTimeById(item.cd_time)
                        });
                    }
                    /* Deleta todos avisos(notices) relacionados ao evento */
                    const notices = await NoticeRepository.findNoticeByEventId(event.cd_event);
                    if (notices) {
                        notices.map(async item => {
                            await NoticeRepository.deleteNoticeById(item.cd_notice)
                        });
                    }
                    /* Deleta todos materiais(materials) relacionados ao evento */
                    const materials = await MaterialRepository.findMaterialByEventId(event.cd_event);
                    if (materials) {
                        materials.map(async item => {
                            await MaterialRepository.deleteMaterialById(item.cd_material)
                        });
                    }
                    /* Deleta o link do mercado pago(link_mercado_pago) relacionado ao evento */
                    const linkMercadoPago = await LinkMercadoPagoRepository.findLinkMercadoPagoByEventId(event.cd_event);
                    if (linkMercadoPago) {
                        await LinkMercadoPagoRepository.deleteLinkMercadoPagoById(linkMercadoPago.cd_link_mercado_pago)
                    }
                    /* Deleta todos convites(invites) relacionados ao evento */
                    const invites = await InviteRepository.findInvitesByEventId(event.cd_event);
                    if (invites) {
                        invites.map(async item => {
                            await InviteRepository.deleteInviteById(item.cd_invite)
                        });
                    }
                    /* Deleta todas as salas de chat(rooms) relacionados ao evento */
                    const rooms = await RoomRepository.findRoomsByEventId(event.cd_event);
                    if (rooms) {
                        rooms.map(async item => {
                            const messages = await MessageRepository.findMessagesByRoomId(item.cd_room);
                            if (messages) {
                                messages.map(async item => {
                                    await MessageRepository.deleteMessageById(item.cd_message)
                                });
                            }
                            await RoomRepository.deleteRoomById(item.cd_room)
                        });
                    }
                    /* Deleta todos acessos relacionados ao evento */
                    const accesses = await AccessRepository.findAccessByEventId(event.cd_event);
                    if (accesses) {
                        accesses.map(async item => {
                            await AccessRepository.deleteAccessById(item.cd_access)
                        });
                    }
                    EventRepository.deleteEventById(event.cd_event)
                        .then(async () => {
                            if (event.cd_location_event) {
                                const locationEvent = await LocationEventRepository.findLocationEventById(event.cd_location_event);
                                LocationEventRepository.deleteLocationEventById(event.cd_location_event);
                                GeolocationRepository.deleteGeolocation(locationEvent.cd_geolocation);
                            }
                            resolve();
                        })
                        .catch((err) => {
                            reject({ status: 400, message: 'Unknown error. Try again later.', error: err });
                        });
                }
            }
        });
    }

    public readEvents(user: User): Promise<Array<EventResponse>> {
        return new Promise(async (resolve) => {
            const access = await AccessRepository.findAccessByUserId(user.cd_user);
            const eventResponse: Array<EventResponse> = [];

            for (let i = 0; access.length > i; i++) {
                const event = await EventRepository.findEventById(access[i].cd_event);
                const locationEvent = await LocationEventRepository.findLocationEventById(event.cd_location_event);
                const geolocation = await GeolocationRepository.findGeolocationById(locationEvent.cd_geolocation);
                const category = await CategoryRepository.findCategoryById(event.sg_category);
                const city = await CityRepository.findCityById(locationEvent.cd_city);
                const privacy = await PrivacyRepository.findPrivacyById(event.sg_privacy);

                const team: Array<TeamMember> = [];
                const event_team = await AccessRepository.findAccessByEventId(event.cd_event);

                for (let i = 0; i < event_team.length; i++) {
                    const role = await RoleRepository.findRole(event_team[i].sg_role);
                    const user = await UserRepository.findUserById(event_team[i].cd_user);

                    team.push({
                        id: user.cd_user,
                        name: user.nm_user,
                        surname: user.nm_surname_user,
                        image: user.im_user,
                        role: {
                            name: role.nm_role,
                            description: role.ds_role
                        }
                    });
                }

                access.forEach(item => {
                    RoleRepository.findRole(item.sg_role)
                        .then(role => {
                            UserRepository.findUserById(item.cd_user)
                                .then(user => {
                                    team.push({
                                        id: user.cd_user,
                                        name: user.nm_user,
                                        surname: user.nm_surname_user,
                                        image: user.im_user,
                                        role: {
                                            name: role.nm_role,
                                            description: role.ds_role
                                        }
                                    })
                                });
                        });
                });

                const startDate = new Date(event.dt_start);
                const endDate = new Date(event.dt_end);

                event.dt_start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
                event.dt_end = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

                if (event.hr_start)
                    event.hr_start = event.hr_start.slice(0, 5);

                if (event.hr_end)
                    event.hr_end = event.hr_end.slice(0, 5);

                eventResponse.push({
                    id: event.cd_event,
                    name: event.nm_event,
                    description: event.ds_event,
                    start_date: event.dt_start,
                    end_date: event.dt_end,
                    start_time: event.hr_start,
                    end_time: event.hr_end,
                    type: event.nm_type,
                    location: {
                        street: locationEvent.nm_street,
                        neighborhood: locationEvent.nm_neighborhood,
                        number: locationEvent.cd_number,
                        cep: locationEvent.cd_cep,
                        complement: locationEvent.nm_complement,
                        geolocation: {
                            latitude: geolocation.cd_latitude,
                            longitude: geolocation.cd_longitude,
                        },
                        city: city.nm_city,
                        uf: city.sg_uf
                    },
                    privacy: {
                        name: privacy.nm_privacy,
                        description: privacy.ds_privacy
                    },
                    category: {
                        name: category.nm_category,
                        description: category.ds_category
                    },
                    team
                });
            }

            resolve(eventResponse);
        });
    }

    public readEvent(idEvent: number, user: User): Promise<EventResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);
            if (!event) {
                reject({ status: 404, message: "This event doesn't exists" });
            } else {
                let permission = true;
                const privacy = await PrivacyRepository.findPrivacyById(event.sg_privacy);
                const access = await AccessRepository.findAccessByEventId(event.cd_event);

                if (privacy.sg_privacy == 'PRI') {
                    permission = false;

                    access.map(item => {
                        if (item.cd_user == user.cd_user)
                            permission = true;
                    });
                }

                if (!permission)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    const locationEvent = await LocationEventRepository.findLocationEventById(event.cd_location_event);
                    const geolocation = await GeolocationRepository.findGeolocationById(locationEvent.cd_geolocation);
                    const category = await CategoryRepository.findCategoryById(event.sg_category);
                    const city = await CityRepository.findCityById(locationEvent.cd_city);

                    const team: Array<TeamMember> = [];

                    for (let i = 0; i < access.length; i++) {
                        const role = await RoleRepository.findRole(access[i].sg_role);
                        const user = await UserRepository.findUserById(access[i].cd_user);

                        team.push({
                            id: user.cd_user,
                            name: user.nm_user,
                            surname: user.nm_surname_user,
                            image: user.im_user,
                            role: {
                                name: role.nm_role,
                                description: role.ds_role
                            }
                        });
                    }

                    access.forEach(item => {
                        RoleRepository.findRole(item.sg_role)
                            .then(role => {
                                UserRepository.findUserById(item.cd_user)
                                    .then(user => {
                                        team.push({
                                            id: user.cd_user,
                                            name: user.nm_user,
                                            surname: user.nm_surname_user,
                                            image: user.im_user,
                                            role: {
                                                name: role.nm_role,
                                                description: role.ds_role
                                            }
                                        })
                                    });
                            });
                    });


                    const startDate = new Date(event.dt_start);
                    const endDate = new Date(event.dt_end);

                    event.dt_start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
                    event.dt_end = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

                    if (event.hr_start)
                        event.hr_start = event.hr_start.slice(0, 5);

                    if (event.hr_end)
                        event.hr_end = event.hr_end.slice(0, 5);

                    const eventResponse: EventResponse = {
                        id: event.cd_event,
                        name: event.nm_event,
                        description: event.ds_event,
                        start_date: event.dt_start,
                        end_date: event.dt_end,
                        start_time: event.hr_start,
                        end_time: event.hr_end,
                        type: event.nm_type,
                        location: {
                            street: locationEvent.nm_street,
                            neighborhood: locationEvent.nm_neighborhood,
                            number: locationEvent.cd_number,
                            cep: locationEvent.cd_cep,
                            complement: locationEvent.nm_complement,
                            geolocation: {
                                latitude: geolocation.cd_latitude,
                                longitude: geolocation.cd_longitude,
                            },
                            city: city.nm_city,
                            uf: city.sg_uf
                        },
                        privacy: {
                            name: privacy.nm_privacy,
                            description: privacy.ds_privacy
                        },
                        category: {
                            name: category.nm_category,
                            description: category.ds_category
                        },
                        team
                    }

                    resolve(eventResponse);
                }
            }
        });
    }

    async quitEvent(user: User, idEvent: number, newCreatorId?: number): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);
            if (!event)
                reject({ status: 404, message: "This events doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'EQP')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (isAllowed) {
                    const access = await AccessRepository.findAccessByEventIdAndUserId(event.cd_event, user.cd_user);

                    /* If he is a creator before leaving the project he must pass his position to another team member */
                    if (access.sg_role == 'CRI') {
                        const eventAccess = await AccessRepository.findAccessByEventId(event.cd_event);

                        if (eventAccess.length == 1)
                            reject({ status: 400, message: "You can't leave an event that only has you" });
                        else {
                            if (!newCreatorId)
                                reject({ status: 400, message: 'For you to exit an event being creator must inform a team member to be the new creator' });
                            else {
                                const newCreator = await UserRepository.findUserById(newCreatorId);
                                if (!newCreator)
                                    reject({ status: 404, message: "This user doesn't exists" });
                                else {
                                    const newCreatorAccess = await AccessRepository.findAccessByEventIdAndUserId(event.cd_event, newCreator.cd_user);

                                    AccessRepository.updateRoleById(newCreatorAccess.cd_access, 'CRI');
                                    await TaskRepository.cleanAccessByAccessId(access.cd_access);
                                    AccessRepository.deleteAccessById(access.cd_access)
                                        .then(() => resolve())
                                        .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later', err }));
                                }
                            }
                        }
                    } else {
                        await TaskRepository.cleanAccessByAccessId(access.cd_access);
                        AccessRepository.deleteAccessById(access.cd_access)
                            .then(() => resolve())
                            .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later', err }));
                    }
                }
            }
        });
    }

    getLinkMercadoPagoAccount(authorization_code: string, state_id: string) {
        return new Promise(async (resolve, reject) => {

            const link = await LinkMercadoPagoRepository.findLinkMercadoPagoByIdentificationId(state_id)
            if (!link)
                reject({ status: 404, message: 'there are no records with this id in our bank' })
            else {
                Axios.post('https://api.mercadopago.com/oauth/token', {
                    client_secret: process.env.ACCESS_TOKEN_MP,
                    grant_type: 'authorization_code',
                    code: authorization_code,
                    redirect_uri: process.env.REDIRECT_URI_MP
                })
                    .then((response) => {

                        const updateLink: updateLinkMercadoPago = {
                            refresh_token: response.data.refresh_token,
                            cd_public_key: response.data.public_key,
                            authorization_code: response.data.authorization_code,
                            id_valid: true,
                            cd_access_token: response.data.access_token,
                        }
                        LinkMercadoPagoRepository.updateLinkMercadoPago(link.cd_link_mercado_pago, updateLink)
                            .then(() => resolve())
                            .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                    })
                    .catch((err) => {
                        reject({ status: 400, message: 'Unknown error. Try again later.', err });
                    });
            }

        });
    }

    linkMercadoPagoAccount(user: User, idEvent: number): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event.cd_event, 'CRI');

                if (!isAllowed)
                    reject({ status: 401, message: 'You are not allowed to do so' });
                else {
                    const searchLinkByEvent = await LinkMercadoPagoRepository.findLinkMercadoPagoByEventId(event.cd_event)
                    if (searchLinkByEvent && searchLinkByEvent.id_valid)
                        reject({ status: 409, message: "This events already linked with Mercado Pago" })
                    else {
                        if (searchLinkByEvent && !searchLinkByEvent.id_valid)
                            LinkMercadoPagoRepository.deleteLinkMercadoPagoById(searchLinkByEvent.cd_link_mercado_pago)
                                .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));

                        const app_id = process.env.APP_ID_MP as string;
                        const redirect_uri = process.env.REDIRECT_URI_MP as string;
                        let random_id = '';
                        let continue_process = false;

                        do {
                            random_id = `${Math.random() * 100}`;
                            const searchLink = await LinkMercadoPagoRepository.findLinkMercadoPagoByIdentificationId(random_id);

                            if (!searchLink)
                                continue_process = true;
                        } while (!continue_process);

                        const link = `https://auth.mercadopago.com.br/authorization?client_id=${app_id}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}&state=${random_id}`;

                        LinkMercadoPagoRepository.insertLinkMercadoPago(random_id, event.cd_event)
                            .then(() => resolve(link))
                            .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                    }
                }
            }
        });
    }

    uploadBanner(user: User, idEvent: number, banner: Express.Multer.File): Promise<EventResponse> {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This events doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'CRI')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) })

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    let type = '';
                    // Verifica se o formato está certo
                    if (banner.mimetype == 'image/png')
                        type = '.png';
                    else
                        type = '.jpg';


                    const eventName = event.nm_event.toLowerCase().replace(' ', '-');
                    // Gera o nome do arquivo e o link que o arquivo será disponibilizado
                    const fileName: string = genNameFile('event', user.cd_user, type);
                    const link = `https://${process.env.BUCKET_NAME}.s3-${process.env.BUCKET_REGION}.amazonaws.com/image/event/${eventName}/banner/${fileName}`;

                    // Configura a request de upload
                    const putObjectRequest: PutObjectRequest =
                    {
                        Bucket: process.env.BUCKET_NAME as string + `/image/event/${eventName}/banner/`,
                        Key: fileName,
                        Body: banner.buffer,
                        ContentLength: banner.size,
                        ACL: 'public-read',
                        ContentType: (type == 'image/jpeg') ? 'image/jpeg' : 'image/png'
                    };

                    // Faz o upload o arquivo
                    s3.upload(putObjectRequest, async (err: Error) => {
                        if (err) {
                            reject({ message: 'Unknown error. Try again later.', error: err });
                        } else {
                            // Persiste o link no banco e retorna o link para o usuário
                            EventRepository.updateEvent(event.cd_event, { im_banner_to: link })
                                .then(async (event) => {
                                    resolve(await this.readEvent(event.cd_event, user));
                                })
                                .catch(e => {
                                    reject({ message: 'Unknown error. Try again later.', error: e })
                                });
                        }
                    });
                }
            }
        });
    }

    removeBanner(user: User, idEvent: number): Promise<EventResponse> {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This events doesn't exists" });
            else {
                if (!event.im_banner || event.im_banner == '')
                    reject({ status: 400, message: "This event doesn't have banner" })
                else {
                    const isAllowed = await havePermission(user.cd_user, idEvent, 'CRI')
                        .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) })

                    if (!isAllowed)
                        reject({ status: 401, message: "You are not allowed to do so" })
                    else {
                        // Gera o nome do arquivo e o link que o arquivo será disponibilizado
                        const eventName = event.nm_event.toLowerCase().replace(' ', '-');
                        const link = event.im_banner;
                        const filename = link.slice(link.search('banner') + 7);

                        // Configura a request de upload
                        const deleteObjectRequest: DeleteObjectRequest =
                        {
                            Bucket: process.env.BUCKET_NAME as string + `/image/event/${eventName}/banner/`,
                            Key: filename
                        };

                        // Faz o upload o arquivo
                        s3.deleteObject(deleteObjectRequest, async (err: Error) => {
                            if (err) {
                                reject({ message: 'Unknown error. Try again later.', error: err });
                            } else {
                                EventRepository.updateEvent(event.cd_event, { im_banner_to: '' })
                                    .then(async (event) => {
                                        resolve(await this.readEvent(event.cd_event, user));
                                    })
                                    .catch(e => {
                                        reject({ message: 'Unknown error. Try again later.', error: e })
                                    });
                            }
                        });
                    }
                }
            }
        });
    }

    searchEvent(user: User, _name?: string, _uf?: string, _city?: string, _distanceMin?: number): Promise<Array<EventResponse>> {

        return new Promise(async (resolve, reject) => {
            let events: Array<Event> = [];
            const eventsResponse: Array<EventResponse> = [];

            _name = (_name === 'undefined' ? undefined : _name);
            _city = (_city === 'undefined' ? undefined : _city);
            _uf = (_uf === 'undefined' ? undefined : _uf);
            _distanceMin = (Number(_distanceMin) ? _distanceMin : undefined);

            if (_name && !_uf && !_city)
                events = await EventRepository.findEventsByName(_name);

            else if (_name && _uf && !_city)
                events = await EventRepository.findEventsByNameAndUf(_name, _uf);

            else if (_name && _city && !_uf)
                events = await EventRepository.findEventsByNameAndCity(_name, _city);

            else if (!_name && _uf && _city)
                events = await EventRepository.findEventsByUfAndCity(_uf, _city);

            else if (!_name && !_uf && _city)
                events = await EventRepository.findEventsByCity(_city);

            else if (!_name && !_city && _uf)
                events = await EventRepository.findEventsByUf(_uf);
            else
                events = await EventRepository.findEventsByNameAndUfAndCity(_name as string, _uf as string, _city as string);;
            console.log('--------------------');

            if (_distanceMin) {
                if (!user.cd_location_user)
                    reject({ status: 400, message: 'Unable to filter events near you without the user having a registered location' });
                else {
                    const location_user = await LocationUserRepository.findLocationUserById(user.cd_location_user);
                    const geolocation_user = await GeolocationRepository.findGeolocationById(location_user.cd_geolocation);

                    for (let i = 0; i < events.length; i++) {
                        const location_event = await LocationEventRepository.findLocationEventById(events[i].cd_location_event);
                        const geolocation_event = await GeolocationRepository.findGeolocationById(location_event.cd_geolocation);

                        const diffDistance =
                            haversine(geolocation_user.cd_latitude, geolocation_user.cd_longitude,
                                geolocation_event.cd_latitude, geolocation_event.cd_longitude);

                        /* Removes the event from the search array if the distance is greater than the requested */
                        if (diffDistance > _distanceMin) {
                            events.splice(i, 1);
                            // Restart distance verification
                            i = -1;
                        }
                    }
                }
            }

            for (let i = 0; events.length > i; i++) {
                const locationEvent = await LocationEventRepository.findLocationEventById(events[i].cd_location_event);
                const geolocation = await GeolocationRepository.findGeolocationById(locationEvent.cd_geolocation);
                const category = await CategoryRepository.findCategoryById(events[i].sg_category);
                const city = await CityRepository.findCityById(locationEvent.cd_city);
                const privacy = await PrivacyRepository.findPrivacyById(events[i].sg_privacy);

                const team: Array<TeamMember> = [];
                const event_team = await AccessRepository.findAccessByEventId(events[i].cd_event);

                for (let i = 0; i < event_team.length; i++) {
                    const role = await RoleRepository.findRole(event_team[i].sg_role);
                    const user = await UserRepository.findUserById(event_team[i].cd_user);

                    team.push({
                        id: user.cd_user,
                        name: user.nm_user,
                        surname: user.nm_surname_user,
                        image: user.im_user,
                        role: {
                            name: role.nm_role,
                            description: role.ds_role
                        }
                    });
                }

                const startDate = new Date(events[i].dt_start);
                const endDate = new Date(events[i].dt_end);

                events[i].dt_start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
                events[i].dt_end = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;

                if (events[i].hr_start)
                    events[i].hr_start = events[i].hr_start.slice(0, 5);

                if (events[i].hr_end)
                    events[i].hr_end = events[i].hr_end.slice(0, 5);

                eventsResponse.push({
                    id: events[i].cd_event,
                    name: events[i].nm_event,
                    description: events[i].ds_event,
                    start_date: events[i].dt_start,
                    end_date: events[i].dt_end,
                    start_time: events[i].hr_start,
                    end_time: events[i].hr_end,
                    type: events[i].nm_type,
                    location: {
                        street: locationEvent.nm_street,
                        neighborhood: locationEvent.nm_neighborhood,
                        number: locationEvent.cd_number,
                        cep: locationEvent.cd_cep,
                        complement: locationEvent.nm_complement,
                        geolocation: {
                            latitude: geolocation.cd_latitude,
                            longitude: geolocation.cd_longitude,
                        },
                        city: city.nm_city,
                        uf: city.sg_uf
                    },
                    privacy: {
                        name: privacy.nm_privacy,
                        description: privacy.ds_privacy
                    },
                    category: {
                        name: category.nm_category,
                        description: category.ds_category
                    },
                    team
                });
            }

            resolve(eventsResponse)
        });
    }
    checkin(user: User, event_id: number, ticket_id: number, token: string) {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" })
            else {
                const isAllowed = havePermission(user.cd_user, event_id, 'EQP')
                    .catch((err) => reject({ status: 401, message: 'You are not allowed to do so', err }))

                if (!isAllowed)
                    reject({ status: 401, message: 'You are not allowed to do so' })
                else {
                    const ticket = await TicketRepository.findTicketById(ticket_id);

                    if (!ticket)
                        reject({ status: 404, message: "This token doesn't exists" })
                    else if (ticket.cd_event != event.cd_event)
                        reject({ status: 409, message: "This ticket doesn't belong to the event" })
                    else {
                        jwt.verify(token, process.env.SECRET_TICKET as string, (err, result) => {
                            if (!result || err)
                            reject({ status: 400, message: 'Invalid token.', err });
                        else {
                            const payload: any = jwt.decode(token);
                            if (event.cd_event != payload.event_id || ticket.cd_ticket != payload.ticket_id)
                                reject({ status: 400, message: "This ticket doesn't belong to the event" })
                            else 
                                resolve();
                        }
                        });
                    }
                }
            }
        })
    }
}

export default EventController;
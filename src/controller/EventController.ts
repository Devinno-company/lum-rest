import NewEvent from "../interfaces/request/NewEvent";
import EventResponse from "../interfaces/response/EventResponse";
import TeamMember from "../interfaces/response/TeamMember";
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
import MapRepository from "../repositorys/MapRepository";
import MaterialRepository from "../repositorys/MaterialRepository";

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

    async deleteEvent(idEvent: number, user: User) {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);
            if (!event) {
                reject({ status: 404, message: "This event doesn't exists" });
            } else {
                const access = await AccessRepository.findAccessByEventIdAndUserId(event.cd_event, user.cd_user);
                if (!access)
                    reject({ status: 403, message: "You are not allowed to do so" })
                else if (access.sg_role != 'CRI') {
                    reject({ status: 403, message: "You are not allowed to do so" })
                }
                else {

                    /* Deleta todas tasks relacionadas ao evento */
                    const tasks = await TaskRepository.findTaskByEventId(event.cd_event);
                    if (tasks) {
                        tasks.map(item => {
                            TaskRepository.deleteTaskById(item.cd_task)
                        });
                    }
                    /* Deleta todos acessos relacionados ao evento */
                    const accesses = await AccessRepository.findAccessByEventId(event.cd_event);
                    if (accesses) {
                        accesses.map(item => {
                            AccessRepository.deleteAccessById(item.cd_access)
                        });
                    }
                    /* Deleta todos tempos(times) relacionados ao evento */
                    const times = await TimeRepository.findTimeByEventId(event.cd_event);
                    if (times) {
                        times.map(item => {
                            TimeRepository.deleteTimeById(item.cd_time)
                        });
                    }
                    /* Deleta todos avisos(notices) relacionados ao evento */
                    const notices = await NoticeRepository.findNoticeByEventId(event.cd_event);
                    if (notices) {
                        notices.map(item => {
                            NoticeRepository.deleteNoticeById(item.cd_notice)
                        });
                    }
                    /* Deleta todos mapas(maps) relacionados ao evento */
                    const maps = await MapRepository.findMapByEventId(event.cd_event);
                    if (maps) {
                        maps.map(item => {
                            MapRepository.deleteMapById(item.cd_map)
                        });
                    }
                    /* Deleta todos materiais(materials) relacionados ao evento */
                    const materials = await MaterialRepository.findMaterialByEventId(event.cd_event);
                    if (materials) {
                        materials.map(item => {
                            MaterialRepository.deleteMaterialById(item.cd_material)
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

    public readEvent(idEvent: number, user: User) {

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
                    reject({ status: 403, message: "You are not allowed to do so" })
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
                    event.hr_start = event.hr_start.slice(0, 5);
                    event.hr_end = event.hr_end.slice(0, 5);

                    const eventResponse: EventResponse = {
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
}

export default EventController;
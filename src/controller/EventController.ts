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

class EventController {

    public insertEvent(newEvent: NewEvent, user: User) {

        return new Promise(async (resolve, reject) => {
            const insertedGeolocation = await GeolocationRepository.insertGeolocation({
                latitude: newEvent.location.geolocation.latitude,
                longitude: newEvent.location.geolocation.longitude
            }).catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));

            const city = await CityRepository.findCityByName(newEvent.location.city);

            if (!city) {
                reject({ status: 400, message: "This city doesn't exists" });
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

                    event.dt_start = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`;
                    event.dt_end = `${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`;
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
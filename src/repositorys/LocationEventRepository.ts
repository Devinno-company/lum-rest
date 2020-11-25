import db from "../database/connection";
import InsertLocationEvent from "../interfaces/inputRepository/insertLocationEvent";
import UpdateLocationEvent from "../interfaces/request/UpdateLocationEventRequest";
import LocationEvent from "../models/LocationEvent";

class LocationEventRepository {

    public static insertLocationEvent(newLocationEvent: InsertLocationEvent, geolocation_id: number, city_id: number): Promise<LocationEvent> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();
            const insertedLocationEvent =
                await trx('tb_location_event')
                    .insert({
                        nm_street: newLocationEvent.street,
                        nm_establishment: newLocationEvent.name_establishment,
                        nm_neighborhood: newLocationEvent.neighborhood,
                        cd_number: newLocationEvent.number,
                        cd_cep: newLocationEvent.cep,
                        nm_complement: newLocationEvent.complement,
                        cd_geolocation: geolocation_id,
                        cd_city: city_id
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedLocationEvent[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        })
    }

    public static async findLocationEventById(idLocationEvent: number): Promise<LocationEvent> {

        return new Promise(async (resolve) => {
            const locationEvent =
                await db('tb_location_event as le')
                    .select('*')
                    .where('le.cd_location_event', '=', idLocationEvent);
        
            resolve(locationEvent[0]);
        });
    }

    public static updateLocationEvent(idLocationEvent: number, updateLocationEvent: UpdateLocationEvent): Promise<LocationEvent> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedEventLocations = await trx('tb_location_event')
                .update({
                    nm_street: updateLocationEvent.street_to,
                    nm_neighborhood: updateLocationEvent.neighborhood_to,
                    nm_establishment: updateLocationEvent.establishment_to,
                    nm_complement: updateLocationEvent.complement_to,
                    cd_number: updateLocationEvent.number_to,
                    cd_cep: updateLocationEvent.cep_to
                })
                .where('cd_location_event', '=', idLocationEvent)
                .returning('*');

            const locationEvent = updatedEventLocations[0];

            trx.commit()
                .then(() => { resolve(locationEvent); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateCityEvent(idLocationEvent: number, city_id: number): Promise<LocationEvent> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedLocationEvent =
                await trx('tb_location_event')
                    .update({
                        cd_city: city_id
                    })
                    .where('cd_location_event', '=', idLocationEvent)
                    .returning('*');

await trx.commit()
                .then(() => { resolve(updatedLocationEvent[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async deleteLocationEventById(idLocationEvent: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_location_event')
                .where('cd_location_event', '=', idLocationEvent)
                .delete();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }
}

export default LocationEventRepository;
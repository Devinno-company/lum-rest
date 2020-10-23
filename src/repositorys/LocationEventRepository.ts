import db from "../database/connection";
import InsertLocationEvent from "../interfaces/inputRepository/insertLocationEvent";
import LocationEvent from "../models/LocationEvent";

class LocationEventRepository {

    public static insertLocationEvent(newLocationEvent: InsertLocationEvent, geolocation_id: number, city_id: number): Promise<LocationEvent> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();
            const insertedLocationEvent =
                await trx('tb_location_event')
                    .insert({
                        nm_street: newLocationEvent.street,
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
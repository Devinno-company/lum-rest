import Geolocation from './../models/Geolocation';
import db from "../database/connection";

class GeolocationRepository {

    public static insertGeolocation(geolocation: {latitude: number, longitude: number}): Promise<Geolocation> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedGeolocation = await trx('tb_geolocation')
                .insert({
                    cd_latitude: geolocation.latitude,
                    cd_longitude: geolocation.longitude
                }).returning('*');

            try {
                await trx.commit();
                resolve(insertedGeolocation[0]);
            } catch (err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static updateGeolocation(idGeolocation: number, geolocation: {latitude: number, longitude: number}): Promise<Geolocation> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedGeolocation = await trx('tb_geolocation')
                .update({
                    cd_latitude: geolocation.latitude,
                    cd_longitude: geolocation.longitude
                })
                .where('cd_geolocation', '=', idGeolocation)
                .returning('*');

            try {
                trx.commit();
                resolve(updatedGeolocation[0]);
            } catch(err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static deleteGeolocation(idGeolocation: number): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            trx('tb_geolocation')
                .delete()
                .where('cd_geolocation', '=', idGeolocation);

            try {
                trx.commit();
                resolve();
            } catch(err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static findGeolocationById(idGeolocation: number): Promise<Geolocation> {

        return new Promise(async (resolve) => {
            const geolocation = await db('tb_geolocation as g')
                .select('*')
                .where('g.cd_geolocation', '=', idGeolocation);

            resolve(geolocation[0]);
        });
    }
}

export default GeolocationRepository;
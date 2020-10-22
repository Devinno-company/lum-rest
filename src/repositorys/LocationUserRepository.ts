import db from "../database/connection";
import LocationUser from "../models/LocationUser";

class LocationUserRepository {

    public static insertLocationUser(city_id: number, geolocation_id: number): Promise<LocationUser> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedLocationUser = await trx('tb_location_user')
                .insert({
                        cd_city: city_id,
                        cd_geolocation: geolocation_id
                    })
                .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedLocationUser[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateCityUser(idLocationUser: number, city_id: number): Promise<LocationUser> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedLocationUser =
                await trx('tb_location_user')
                    .update({
                        cd_city: city_id
                    })
                    .where('cd_location_user', '=', idLocationUser)
                    .returning('*');

await trx.commit()
                .then(() => { resolve(updatedLocationUser[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static deleteLocationUserById(idLocationUser: number) {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_location_user')
                .where('cd_location_user', '=', idLocationUser)
                .del();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static findLocationUserById(idLocationUser: number): Promise<LocationUser> {

        return new Promise(async (resolve) => {

            const searchLocationUser = await db('tb_location_user as lu')
                .select('*')
                .where('lu.cd_location_user', '=', idLocationUser);

            resolve(searchLocationUser[0])
        });
    }

    public static findLocationUserByUserId(idUser: number): Promise<LocationUser> {

        return new Promise(async (resolve) => {

            const searchLocationUser = await db('tb_location_user as lu')
                .select('lu.cd_location_user, lu.cd_geolocation, lu.cd_city')
                .join('tb_user as u', 'u.cd_location_user', 'lu.cd_location_user')
                .where('u.cd_user', '=', idUser);

            resolve(searchLocationUser[0])
        });
    }
}

export default LocationUserRepository;
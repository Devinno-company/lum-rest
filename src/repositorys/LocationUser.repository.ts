import db from "../database/connection";
import UpdateLocationUser from "../interfaces/request/UpdateLocationUser";
import LocationUser from "../models/LocationUser";
import CityRepository from "./City.repository";
import GeolocationRepository from "./Geolocation.repository";

class LocationUserRepository {

    public static insertLocationUser(locationUser: { geolocation: { latitude: number, longitude: number }, city: string }): Promise<LocationUser> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedGeolocation = await GeolocationRepository.insertGeolocation(locationUser.geolocation);
            const searchCity = await CityRepository.findCityByName(locationUser.city);

            if (!searchCity)
                reject({ message: 'This city not exists', status: 400 });
            else {
                const geolocation_id = insertedGeolocation.cd_geolocation;
                const city_id = searchCity.cd_city;

                const insertedLocationUser = await trx('tb_location_user')
                    .insert(
                        {
                            cd_city: city_id,
                            cd_geolocation: geolocation_id
                        }
                    )
                    .returning('*');

                try {
                    await trx.commit();
                    resolve(insertedLocationUser[0]);
                } catch (err) {
                    trx.rollback();
                    reject(err)
                }
            }
        });
    }

    public static updateLocationUser(idLocationUser: number, updateLocationUser: UpdateLocationUser): Promise<LocationUser> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();
            const locationUser = await this.findLocationUserById(idLocationUser);

            if (!locationUser)
                reject({ message: 'Location user not found', status: 404 });
            else {
                if (updateLocationUser.geolocation) {
                    GeolocationRepository.updateGeolocation(locationUser.cd_geolocation, updateLocationUser.geolocation)
                        .catch(err => reject(err));
                }
                if (updateLocationUser.city) {
                    const searchCity = await CityRepository.findCityByName(updateLocationUser.city)
                        .catch(err => reject(err));

                    if (searchCity)
                        await trx('tb_location_user')
                            .update({
                                cd_city: searchCity.cd_city
                            });
                }

                const updatedLocationUser = await this.findLocationUserById(idLocationUser);

                try {
                    trx.commit();
                    resolve(updatedLocationUser);
                } catch (err){
                    trx.rollback();
                    reject(err);
                }
            }
        });
    }

    public static deleteLocationUserById(idLocationUser: number) {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            trx('tb_location_user')
                .delete()
                .where('cd_location_user', '=', idLocationUser);

                try {
                    trx.commit();
                    resolve();
                } catch (err){
                    trx.rollback();
                    reject(err);
                }
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
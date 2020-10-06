import db from "../database/connection";
import City from "../models/City";

class CityRepository {
    
    public static findCityByName(nameCity: string): Promise<City> {

        return new Promise(async (resolve) => {
            const searchCity = await db('tb_city as c')
                .select('*')
                .where('c.nm_city', '=', nameCity);

            resolve(searchCity[0]);
        });
    }

    public static findCityById(idCity: number): Promise<City> {

        return new Promise(async (resolve) => {
            const searchCity = await db('tb_city as c')
                .select('*')
                .where('c.cd_city', '=', idCity);

            resolve(searchCity[0]);
        });
    }
}

export default CityRepository;
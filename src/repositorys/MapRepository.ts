import db from "../database/connection";
import Map from "../models/Map";

class MapRepository {

    public static insertMap(map_url: string, map_desc: string, event_code: number): Promise<Map> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedMap =
                await trx('tb_map')
                    .insert({
                        im_map: map_url,
                        ds_map: map_desc,
                        cd_event: event_code
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedMap[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findMapById(idMap: number): Promise<Array<Map>> {

        return new Promise(async (resolve) => {
            const map =
            await db('tb_map as m')
                .select('*')
                .where('m.cd_map', '=', idMap);

            resolve(map);
        });
    }

    public static async findMapByEventId(idEvent: number): Promise<Array<Map>> {

        return new Promise(async (resolve) => {
            const map =
            await db('tb_map as m')
                .select('*')
                .where('m.cd_event', '=', idEvent);

            resolve(map);
        });
    }

    public static async deleteMapById(idMap: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_map')
                .where('cd_map', '=', idMap)
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

export default MapRepository;
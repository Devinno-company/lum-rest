import db from "../database/connection";
import Time from "../models/Time";

class TimeRepository {

    public static insertTime(time_name: string, time_desc: string, time_date: string, time_start_hour: string, time_end_hour: string, event_code: number): Promise<Time> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedTime =
                await trx('tb_time')
                    .insert({
                        nm_time: time_name,
                        ds_time: time_desc,
                        dt_time: time_date,
                        hr_start: time_start_hour,
                        hr_end: time_end_hour,
                        cd_event: event_code
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedTime[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findTimeById(idTime: number): Promise<Array<Time>> {

        return new Promise(async (resolve) => {
            const time =
            await db('tb_time as t')
                .select('*')
                .where('t.cd_time', '=', idTime);

            resolve(time);
        });
    }

    public static async findTimeByEventId(idEvent: number): Promise<Array<Time>> {

        return new Promise(async (resolve) => {
            const time =
            await db('tb_time as t')
                .select('*')
                .where('t.cd_event', '=', idEvent);

            resolve(time);
        });
    }

    public static async deleteTimeById(idTime: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_time')
                .where('cd_time', '=', idTime)
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

export default TimeRepository;
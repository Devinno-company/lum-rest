import db from "../database/connection";
import Time from "../models/Time";
import InsertTime from "../interfaces/inputRepository/insertTime";
import UpdateTime from "../interfaces/request/UpdateTimeRequest";

class TimeRepository {

    public static insertTime(insertTime: InsertTime, event_code: number): Promise<Time> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedTime =
                await trx('tb_time')
                    .insert({
                        nm_time: insertTime.nm_time,
                        ds_time: insertTime.ds_time,
                        dt_time: insertTime.dt_time,
                        hr_start: insertTime.hr_start,
                        hr_end: insertTime.hr_end,
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

    public static async findTimeById(idTime: number): Promise<Time> {

        return new Promise(async (resolve) => {
            const time =
            await db('tb_time as t')
                .select('*')
                .where('t.cd_time', '=', idTime);

            resolve(time[0]);
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

    public static updateTime(idTime: number, updateTime: UpdateTime): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTime =
            await trx('tb_time')
                .update({
                    nm_time: updateTime.nm_time_to,
                    ds_time: updateTime.ds_time_to,
                    dt_time: updateTime.dt_time_to,
                    hr_start: updateTime.hr_start_to,
                    hr_end: updateTime.hr_end_to
                })
                .where('cd_time', '=', idTime);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback(updatedTime);
                    reject(err);
                });
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
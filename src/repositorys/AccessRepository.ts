import db from "../database/connection";
import Access from "../models/Access";

class AccessRepository {

    public static insertAccess(user_id: number, event_id: number, role: string): Promise<Access> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedAccess =
                await trx('tb_access')
                    .insert({
                        cd_user: user_id,
                        cd_event: event_id,
                        sg_role: role
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedAccess[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findAccessByEventId(idEvent: number): Promise<Array<Access>> {

        return new Promise(async (resolve) => {
            const access =
            await db('tb_access as a')
                .select('*')
                .where('a.cd_event', '=', idEvent);

            resolve(access);
        });
    }

    public static async findAccessByEventIdAndUserId(idEvent: number, idUser: number): Promise<Array<Access>> {

        return new Promise(async (resolve) => {
            const access =
            await db('tb_access as a')
                .select('*')
                .where('a.cd_event', '=', idEvent)
                .where('a.cd_user', '=', idUser);


            resolve(access);
        });
    }

    public static async deleteAccessById(idAccess: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_access')
                .where('cd_access', '=', idAccess)
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

export default AccessRepository;
import db from "../database/connection";
import Notice from "../models/Notice";

class NoticeRepository {

    public static insertNotice(notice_name: string, notice_description: string, notice_priority: number, event_code: number, sg_urgency: number): Promise<Notice> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedNotice =
                await trx('tb_notice')
                    .insert({
                        nm_notice: notice_name,
                        ds_notice: notice_description,
                        qt_priority: notice_priority,
                        cd_event: event_code,
                        sg_urgency: sg_urgency
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedNotice[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findNoticeById(idNotice: number): Promise<Array<Notice>> {

        return new Promise(async (resolve) => {
            const notice =
            await db('tb_notice as n')
                .select('*')
                .where('n.cd_notice', '=', idNotice);

            resolve(notice);
        });
    }

    public static async findNoticeByEventId(idEvent: number): Promise<Array<Notice>> {

        return new Promise(async (resolve) => {
            const notice =
            await db('tb_notice as n')
                .select('*')
                .where('n.cd_event', '=', idEvent);

            resolve(notice);
        });
    }

    public static async deleteNoticeById(idNotice: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_notice')
                .where('cd_notice', '=', idNotice)
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

export default NoticeRepository;
import db from "../database/connection";
import InsertNotice from "../interfaces/inputRepository/insertNotice";
import UpdateNoticeRequest from "../interfaces/request/UpdateNoticeRequest";
import Notice from "../models/Notice";
import NoticeJoinUrgency from "../models/NoticeJoinUrgency";

class NoticeRepository {

    public static insertNotice(newNotice: InsertNotice, event_id: number, urgency_id: "URG" | "IMP" | "REL"): Promise<Notice> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedNotice =
                await trx('tb_notice')
                    .insert({
                        nm_notice: newNotice.notice_name,
                        ds_notice: newNotice.notice_description,
                        qt_priority: newNotice.notice_priority,
                        cd_event: event_id,
                        sg_urgency: urgency_id
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedNotice[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findNoticeById(idNotice: number): Promise<Notice> {

        return new Promise(async (resolve) => {
            const notice =
            await db('tb_notice as n')
                .select('*')
                .where('n.cd_notice', '=', idNotice);

            resolve(notice[0]);
        });
    }

    public static async findNoticeByEventId(idEvent: number): Promise<Array<NoticeJoinUrgency>> {

        return new Promise(async (resolve) => {
            const notice =
            await db('tb_notice as n')
                .select('*','n.qt_priority as notice_priority', 'u.qt_priority as urgency_priority')
                .where('n.cd_event', '=', idEvent)
                .join('tb_urgency as u', 'u.sg_urgency', 'n.sg_urgency')
                .orderBy('u.qt_priority', "desc")
                .orderBy('n.qt_priority', 'desc');
            
            resolve(notice);
        });
    }

    public static async updateNoticeById(idNotice: number, updateNotice: UpdateNoticeRequest): Promise<Notice> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedNotice =
            await trx('tb_notice')
                .update({
                    nm_notice: updateNotice.name_to,
                    ds_notice: updateNotice.description_to,
                    qt_priority: updateNotice.priority_to,
                    sg_urgency: updateNotice.urgency_to
                })
                .where('cd_notice', '=', idNotice)
                .returning('*');
                

            trx.commit()
                .then(() => { resolve(updatedNotice[0]); })
                .catch((err) => {
                                    
                    trx.rollback();
                    reject(err);
                });
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
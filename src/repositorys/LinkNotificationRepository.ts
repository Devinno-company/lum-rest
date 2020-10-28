import db from "../database/connection";
import LinkNotification from "../models/LinkNotification";

class LinkNotificationRepository {

    public static insertLinkNotification(idItem: number, sgType: string): Promise<LinkNotification> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedLinkNotification = await trx('tb_link_notification')
                    .insert({
                        cd_item: idItem,
                        sg_type: sgType
                    })
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedLinkNotification[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findLinkNotificationById(idLink: number): Promise<LinkNotification> {

        return new Promise(async (resolve) => {
            const link_notification =
            await db('tb_link_notification as l')
                .select('*')
                .where('l.cd_link', '=', idLink);

            resolve(link_notification[0]);
        });
    }

    public static async findLinkNotificationByType(sgType: string): Promise<Array<LinkNotification>> {

        return new Promise(async (resolve) => {
            const link_notification =
            await db('tb_link_notification as l')
                .select('*')
                .where('l.sg_type', '=', sgType);

            resolve(link_notification);
        });
    }

    public static async deleteLinkNotificationById(idLink: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_link_notification')
                .where('cd_link', '=', idLink)
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

export default LinkNotificationRepository;
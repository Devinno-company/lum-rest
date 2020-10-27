import db from "../database/connection";
import Notification from "../models/Notification";
import InsertNotification from "../interfaces/inputRepository/insertNotification";

class NotificationRepository {

    public static insertNotification(newNotification: InsertNotification, idUser: number, idLink: number): Promise<Notification> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedNotification =
                await trx('tb_notification')
                    .insert({
                        nm_title: newNotification.notification_title,
                        ds_content: newNotification.notification_content,
                        cd_read: newNotification.notification_read,
                        cd_user: idUser,
                        cd_link: idLink
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedNotification[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateRead(idNotification: number, isRead: string): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_notification')
                .update({
                    cd_read: isRead
                })
                .where('cd_notification', '=', idNotification);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findNotificationById(idNotification: number): Promise<Notification> {

        return new Promise(async (resolve) => {
            const notification =
            await db('tb_notification as n')
                .select('*')
                .where('n.cd_notification', '=', idNotification);

            resolve(notification[0]);
        });
    }

    public static async findNotificationByUserId(idUser: number): Promise<Array<Notification>> {

        return new Promise(async (resolve) => {
            const notification =
            await db('tb_notification as n')
                .select('*')
                .where('n.cd_user', '=', idUser);

            resolve(notification);
        });
    }

    public static async deleteNotificationById(idNotification: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_notification')
                .where('cd_notification', '=', idNotification)
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

export default NotificationRepository;
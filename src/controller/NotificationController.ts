import NotificationResponse from "../interfaces/response/NotificationResponse";
import User from "../models/User";
import NotificationRepository from "../repositorys/NotificationRepository";
import LinkNotificationRepository from "../repositorys/LinkNotificationRepository";



class NotificationController {

    async readNotification(user: User, idNotification: number): Promise<NotificationResponse> {

        return new Promise(async (resolve, reject) => {
            const notification = await NotificationRepository.findNotificationById(idNotification);
            if (!notification)
                reject({ status: 404, message: "This notification doesn't exists" });
            else {
                if (notification.cd_user != user.cd_user)
                    reject({ status: 401, message: 'You are not allowed to do so' });
                else {
                    const link = await LinkNotificationRepository.findLinkNotificationById(notification.cd_link);

                    resolve({
                        id: notification.cd_notification,
                        title: notification.nm_title,
                        content: notification.ds_content,
                        isRead: notification.cd_read,
                        link: {
                            idItem: link.cd_item,
                            type: link.sg_type
                        },
                        idUser: notification.cd_user
                    });
                }
            }
        });
    }

    async readNotifications(user: User): Promise<Array<NotificationResponse>> {

        return new Promise(async (resolve) => {
            const notifications = await NotificationRepository.findNotificationByUserId(user.cd_user);
            const notificationsResponse: Array<NotificationResponse> = [];

            for (let i = 0; i < notifications.length; i++) {
                const link = await LinkNotificationRepository.findLinkNotificationById(notifications[i].cd_link);

                notificationsResponse.push({
                    id: notifications[i].cd_notification,
                    title: notifications[i].nm_title,
                    content: notifications[i].ds_content,
                    isRead: notifications[i].cd_read,
                    link: {
                        idItem: link.cd_item,
                        type: link.sg_type,
                    },
                    idUser: notifications[i].cd_user
                });
            }

            resolve(notificationsResponse);
        });
    }

    async choiceRead(user: User, idNotification: number, choice: string) {

        return new Promise(async (resolve, reject) => {
            const notification = await NotificationRepository.findNotificationById(idNotification);

            if (!notification)
                reject({ status: 404, message: "This notification doesn't exist" });
            else {
                if (notification.cd_user != user.cd_user)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    switch (choice) {
                        case 'read':
                            NotificationRepository.updateRead(notification.cd_notification, 'true')
                                .then(async () => {
                                    resolve(await this.readNotification(user, notification.cd_notification));
                                })
                                .catch((err) => {
                                    reject({ status: 400, message: 'Unknown error. Try again later.', err });
                                });
                            break;
                        case 'unread':
                            NotificationRepository.updateRead(notification.cd_notification, 'false')
                                .then(async () => {
                                    resolve(await this.readNotification(user, notification.cd_notification));
                                })
                                .catch((err) => {
                                    reject({ status: 400, message: 'Unknown error. Try again later.', err });
                                });
                            break;
                        default:
                            reject({ status: 400, message: 'Invalid choice.' });
                    }

                }
            }
        });
    }

    deleteNotification(user: User, idNotification: number) {
        return new Promise(async (resolve, reject) => {
            const notification = await NotificationRepository.findNotificationById(idNotification);

            if (!notification)
                reject({ status: 404, message: "This notification doesn't exist" })
            else {
                if (notification.cd_user != user.cd_user)
                    reject({ status: 401, message: "You are not allowed do so" });
                else {
                    NotificationRepository.deleteNotificationById(idNotification)
                        .then(() => { resolve() })
                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); })
                }
            }
        });
    }
}

export default NotificationController;
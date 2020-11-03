import NewNoticeRequest from "../interfaces/request/NewNoticeRequest";
import UpdateNoticeRequest from "../interfaces/request/UpdateNoticeRequest";
import NoticeResponse from "../interfaces/response/NoticeResponse";
import User from "../models/User";
import EventRepository from "../repositorys/EventRepository";
import NoticeRepository from "../repositorys/NoticeRepository";
import UrgencyRepository from "../repositorys/UrgencyRepository";
import havePermission from "../utils/havePermission";

class NoticeController {

    insertNotice(user: User, idEvent: number, newNotice: NewNoticeRequest): Promise<NoticeResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event.cd_event, "COO")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    if (newNotice.urgency != "URG" && newNotice.urgency != "IMP" && newNotice.urgency != "REL")
                        reject({ status: 400, message: "This urgency is invalid." });
                    else {
                        NoticeRepository.insertNotice({
                            notice_name: newNotice.name,
                            notice_description: newNotice.description,
                            notice_priority: newNotice.priority
                        }, event.cd_event, newNotice.urgency)
                            .then(async (insertedNotice) => { resolve(await this.readNotice(user, event.cd_event, insertedNotice.cd_notice)) })
                            .catch((err) => reject({ status: 400, message: "Unknown error. Try again later.", err }));
                    }
                }
            }
        });
    }

    readNotice(user: User, idEvent: number, idNotice: number): Promise<NoticeResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event.cd_event, "EQP")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const notice = await NoticeRepository.findNoticeById(idNotice);

                    if (!notice)
                        reject({ status: 404, message: "This notice doesn't exists" });
                    else {
                        const urgency = await UrgencyRepository.findUrgencyById(notice.sg_urgency);

                        resolve({
                            id: notice.cd_notice,
                            name: notice.nm_notice,
                            description: notice.ds_notice,
                            priority: notice.qt_priority,
                            urgency: {
                                name: urgency.nm_urgency,
                                priority: urgency.qt_priority
                            }
                        });
                    }
                }
            }
        });
    }

    readNotices(user: User, idEvent: number): Promise<Array<NoticeResponse>> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event.cd_event, "EQP")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const notices = await NoticeRepository.findNoticeByEventId(event.cd_event);
                    const noticesResponse: Array<NoticeResponse> = [];

                    for (let i = 0; i < notices.length; i++) {

                        noticesResponse.push({
                            id: notices[i].cd_notice,
                            name: notices[i].nm_notice,
                            description: notices[i].ds_notice,
                            priority: notices[i].notice_priority,
                            urgency: {
                                name: notices[i].nm_urgency,
                                priority: notices[i].urgency_priority
                            }
                        });
                    }

                    resolve(noticesResponse);
                }
            }
        });
    }

    updateNotice(user: User, idEvent: number, idNotice: number, updateNotice: UpdateNoticeRequest): Promise<NoticeResponse> {

        return new Promise(async (resolve, reject) => {
            
            if (JSON.stringify(updateNotice) === '{}') {
                reject({ status: 400, message: 'No field to update' });
            } else {
                const event = await EventRepository.findEventById(idEvent);

                if (!event)
                    reject({ status: 404, message: "This event doesn't exists" });
                else {
                    const isAllowed = await havePermission(user.cd_user, event.cd_event, "COO")
                        .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                    if (!isAllowed)
                        reject({ status: 401, message: "You are not allowed to do so" });
                    else {
                        const notice = await NoticeRepository.findNoticeById(idNotice);

                        if (!notice)
                            reject({ status: 404, message: "This notice doesn't exists" });
                        else {
                            if (updateNotice.urgency_to) {
                                if (updateNotice.urgency_to != "URG" && updateNotice.urgency_to != "IMP" && updateNotice.urgency_to != "REL")
                                    reject({ status: 400, message: "This urgency is invalid." });
                                else {
                                    
                                    NoticeRepository.updateNoticeById(notice.cd_notice, updateNotice)
                                        .then(async (result) => resolve(await this.readNotice(user, event.cd_event, result.cd_notice)))
                                        .catch((err) => reject({ status: 400, message: "Unknown error. Try again later.", err }));
                                }
                            } else {
                                
                                NoticeRepository.updateNoticeById(notice.cd_notice, updateNotice)
                                        .then(async (result) => resolve(await this.readNotice(user, event.cd_event, result.cd_notice)))
                                        .catch((err) => reject({ status: 400, message: "Unknown error. Try again later.", err }));
                            }
                        }
                    }
                }
            }
        });
    }

    deleteNotice(user: User, idEvent: number, idNotice: number): Promise<NoticeResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event.cd_event, "COO")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const notice = await NoticeRepository.findNoticeById(idNotice);

                    if (!notice)
                        reject({ status: 404, message: "This notice doesn't exists" });
                    else {
                        NoticeRepository.deleteNoticeById(notice.cd_notice)
                            .then(() => resolve())
                            .catch((err) => reject({ status: 400, message: "Unknown error. Try again later.", err }));
                    }
                }
            }
        });
    }
}

export default NoticeController;
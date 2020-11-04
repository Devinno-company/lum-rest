import MessageResponse from "../interfaces/response/MessageResponse";
import RoomResponse from "../interfaces/response/RoomResponse";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import LinkNotificationRepository from "../repositorys/LinkNotificationRepository";
import MessageRepository from "../repositorys/MessageRepository";
import NotificationRepository from "../repositorys/NotificationRepository";
import RoomRepository from "../repositorys/RoomRepository";
import UserRepository from "../repositorys/UserRepository";
import getMessagesResponse from "../utils/getMessagesResponse";
import havePermission from "../utils/havePermission";

class ChatEventController {

    readChats(user: User, event_id: number): Promise<Array<RoomResponse>> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" })
            else {
                const isAllowed = await havePermission(user.cd_user, event_id, "EQP")
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    const rooms = await RoomRepository.findRoomsByEventId(event.cd_event);
                    const roomsResponse: Array<RoomResponse> = [];

                    for (let i = 0; i < rooms.length; i++) {
                        const messages = await MessageRepository.findMessagesByRoomId(rooms[i].cd_room);
                        const messagesResponse: Array<MessageResponse> = getMessagesResponse(messages);

                        roomsResponse.push({
                            id: rooms[i].cd_room,
                            user_id: rooms[i].cd_user,
                            event_id: rooms[i].cd_event,
                            messages: messagesResponse
                        });
                    }

                    resolve(roomsResponse);
                }
            }
        });
    }

    readChat(user: User, event_id: number, room_id: number): Promise<RoomResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" })
            else {
                const isAllowed = await havePermission(user.cd_user, event_id, "EQP")
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    const room = await RoomRepository.findRoomById(room_id);

                    if (!room)
                        reject({ status: 404, message: "This chat doesn't exists" });
                    else if (room.cd_event != event.cd_event)
                        reject({ status: 409, message: 'This chat does not belong to this event' });
                    else {
                        const messages = await MessageRepository.findMessagesByRoomId(room_id);
                        const messagesResponse: Array<MessageResponse> = getMessagesResponse(messages);

                        resolve({
                            id: room.cd_room,
                            user_id: room.cd_user,
                            event_id: room.cd_event,
                            messages: messagesResponse
                        });
                    }
                }
            }
        });
    }

    insertMessage(user: User, event_id: number, room_id: number, message: string): Promise<RoomResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event_id, 'EQP')
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));

                if (!isAllowed)
                    reject({ status: 401, message: 'You are not allowed to do so' })
                else {
                    const room = await RoomRepository.findRoomById(room_id);

                    if (!room)
                        reject({ status: 404, message: "This chat doesn't exists" });

                    await MessageRepository.insertMessage(message, room_id, undefined, event_id);
                    const messages = await MessageRepository.findMessagesByRoomId(room.cd_room);
                    const messageResponse: Array<MessageResponse> = getMessagesResponse(messages);

                    /* Send notification to event team */
                    EventRepository.findEventById(room.cd_event)
                        .then(event =>
                            LinkNotificationRepository.insertLinkNotification(room.cd_room, "MSE")
                                .then(async (link) => {
                                    NotificationRepository.insertNotification({
                                        notification_title: "Nova mensagem recebida!",
                                        notification_content: `O evento ${event.nm_event} te enviou uma nova mensagem`,
                                        notification_read: false
                                    }, room.cd_user, link.cd_link)
                                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                })
                                .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) })
                        );

                    resolve({
                        id: room.cd_room,
                        user_id: room.cd_user,
                        event_id: room.cd_event,
                        messages: messageResponse
                    });
                }
            }
        });
    }
}

export default ChatEventController;
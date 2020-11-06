import MessageResponse from "../interfaces/response/MessageResponse";
import RoomResponse from "../interfaces/response/RoomResponse";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import LinkNotificationRepository from "../repositorys/LinkNotificationRepository";
import MessageRepository from "../repositorys/MessageRepository";
import NotificationRepository from "../repositorys/NotificationRepository";
import RoomRepository from "../repositorys/RoomRepository";
import getMessagesResponse from "../utils/getMessagesResponse";

class ChatUserController {

    newChat(user: User, event_id: number, message: string): Promise<RoomResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else if (event.sg_privacy == "PRI")
                reject({ status: 401, message: "Can't send messages to private events" })
            else {
                let searchRoom = await RoomRepository.findRoomByEventIdAndUserId(event_id, user.cd_user);

                if (searchRoom)
                    reject({ status: 400, message: 'This chat already created' });
                else {
                    await RoomRepository.insertRoom(event_id, user.cd_user);
                    const room = await RoomRepository.findRoomByEventIdAndUserId(event_id, user.cd_user)

                    await MessageRepository.insertMessage(message, room.cd_room, user.cd_user);
                    const messages = await MessageRepository.findMessagesByRoomId(room.cd_room);
                    const messageResponse: Array<MessageResponse> = getMessagesResponse(messages);

                    /* Send notification to event team */
                    LinkNotificationRepository.insertLinkNotification(event.cd_event, "MSU")
                        .then(async (link) => {
                            const team = await AccessRepository.findAccessByEventId(event.cd_event);

                            team.map(access => {
                                NotificationRepository.insertNotification({
                                    notification_title: "Nova mensagem de usuário",
                                    notification_content: `O evento ${event.nm_event} recebeu uma nova mensagem`,
                                    notification_read: false
                                }, access.cd_user, link.cd_link)
                                    .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                            })
                        })
                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });

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

    insertMessage(user: User, room_id: number, message: string): Promise<RoomResponse> {

        return new Promise(async (resolve, reject) => {

            let room = await RoomRepository.findRoomById(room_id);

            if (!room)
                reject({ status: 400, message: "This chat doen't exists" });
            else {
                await MessageRepository.insertMessage(message, room_id, user.cd_user);
                const messages = await MessageRepository.findMessagesByRoomId(room_id);
                const messageResponse: Array<MessageResponse> = getMessagesResponse(messages);

                /* Send notification to event team */
                EventRepository.findEventById(room.cd_event)
                    .then(event => {
                            LinkNotificationRepository.insertLinkNotification(event.cd_event, "MSU")
                                .then(async (link) => {
                                    const team = await AccessRepository.findAccessByEventId(event.cd_event);

                                    team.map(access => {
                                        NotificationRepository.insertNotification({
                                            notification_title: "Nova mensagem de usuário",
                                            notification_content: `O evento ${event.nm_event} recebeu uma nova mensagem`,
                                            notification_read: false
                                        }, access.cd_user, link.cd_link)
                                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                    })
                                })
                                .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) })
                        }
                    );

                resolve({
                    id: room.cd_room,
                    user_id: room.cd_user,
                    event_id: room.cd_event,
                    messages: messageResponse
                });
            }
        });
    }

    readChats(user: User) {

        return new Promise(async (resolve) => {

            const rooms = await RoomRepository.findRoomsByUserId(user.cd_user);
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
        });
    }

    readChat(user: User, room_id: number): Promise<RoomResponse> {

        return new Promise(async (resolve, reject) => {

            const room = await RoomRepository.findRoomById(room_id);

            if (!room)
                reject({ status: 404, message: "This chat doesn't exists" });
            else if (room.cd_user != user.cd_user)
                reject({ status: 401, message: 'You are not allowed to do so' });
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
        });
    }
}

export default ChatUserController;
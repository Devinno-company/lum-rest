import MessageResponse from "../interfaces/response/MessageResponse";
import Message from "../models/Message";

function getMessagesResponse(messages: Array<Message>): Array<MessageResponse> {

    const messagesResponse: Array<MessageResponse> = [];

    for (let i = 0; i < messages.length; i++) {
        let type: 'USR' | 'EVT';

        if (messages[i].cd_user)
            type = 'USR';
        else
            type = 'EVT';

        messagesResponse.push({
            id: messages[i].cd_message,
            message: messages[i].ds_message,
            author: {
                id: (type === "USR" ? messages[i].cd_user : messages[i].cd_event) as number,
                type: type
            },
            sended_at: messages[i].hr_sended
        });
    }

    return messagesResponse;
}

export default getMessagesResponse;
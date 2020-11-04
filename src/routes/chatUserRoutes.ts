import express from 'express';
import ChatUserController from '../controller/ChatUserController';
import NewChatRequest from '../interfaces/request/NewChatRequest';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const chatUserRoutes = express.Router();
const controller = new ChatUserController();

chatUserRoutes.post('/newChat', verifyToken, validate, (request, response) => {
    const newChat: NewChatRequest = request.body

    getUserByRequest(request)
        .then(user =>
            controller.newChat(user, newChat.event_id, newChat.message)
                .then((result) => response.status(201).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

chatUserRoutes.post('/chats/:idChat', verifyToken, validate, (request, response) => {
    const idChat = request.params['idChat'];
    const newMessage: { message: string } = request.body;

    if (!Number(idChat))
        response.status(400).json({ status: 400, message: 'Chat id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.insertMessage(user, Number(idChat), newMessage.message)
                .then((result) => response.status(201).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

chatUserRoutes.get('/chats', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user =>
            controller.readChats(user)
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

chatUserRoutes.get('/chats/:idChat', verifyToken, (request, response) => {
    const idChat = request.params['idChat'];

    if (!Number(idChat))
        response.status(400).json({ status: 400, message: 'Chat id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.readChat(user, Number(idChat))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

export default chatUserRoutes;
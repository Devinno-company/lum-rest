import express from 'express';
import ChatEventController from '../controller/ChatEventController';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const chatEventRoutes = express.Router();
const controller = new ChatEventController();

chatEventRoutes.get('/events/:idEvent/chats', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.readChats(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

chatEventRoutes.get('/events/:idEvent/chats/:idChat', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent']
    const idChat = request.params['idChat'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idChat))
        response.status(400).json({ status: 400, message: 'Chat id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.readChat(user, Number(idEvent), Number(idChat))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

chatEventRoutes.post('/events/:idEvent/chats/:idChat', verifyToken, validate, (request, response) => {
    const idEvent = request.params['idEvent']
    const idChat = request.params['idChat'];
    const newMessage: { message: string } = request.body;

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idChat))
        response.status(400).json({ status: 400, message: 'Chat id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.insertMessage(user, Number(idEvent), Number(idChat), newMessage.message)
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

export default chatEventRoutes;
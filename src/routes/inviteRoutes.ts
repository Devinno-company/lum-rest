import InviteController from "../controller/InviteController";
import express, { request } from 'express';
import InviteUserRequest from "../interfaces/request/InviteUserRequest";
import verifyToken from "../middleware/verifyToken";
import getUserByRequest from "../utils/getUserByRequest";
import validate from "../middleware/inputValidation";

const inviteRoutes = express.Router();
const controller = new InviteController();

inviteRoutes.post('/events/:idEvent/invite', verifyToken, validate, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const inviteUser: InviteUserRequest = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.inviteUser(user, Number(idEvent), inviteUser)
                .then(() => response.status(201).json())
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

inviteRoutes.get('/invites', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readInvites(user)
                .then((invites) => response.status(200).json(invites))
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

inviteRoutes.get('/invites/:idInvite', verifyToken, (request, response) => {
    const idInvite = request.params['idInvite'];

    if(!Number(idInvite))
        response.status(400).json({status: 400, message: 'Id invalid.'});

    getUserByRequest(request)
        .then(user => {
            controller.readInvite(user, Number(idInvite))
                .then((invite) => response.status(200).json(invite))
                .catch((err) => response.status(err.status | 400). json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

inviteRoutes.patch('/invites/:idInvite', verifyToken, validate, (request, response) => {
    const idInvite = request.params['idInvite'];
    const choice = request.body.choice;

    if (!Number(idInvite))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.choiceInvite(user, Number(idInvite), choice)
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

inviteRoutes.delete('/invites/:idInvite', verifyToken, (request, response) => {
    const idInvite = request.params['idInvite'];

    if (!Number(idInvite))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.deleteInvite(user, Number(idInvite))
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default inviteRoutes
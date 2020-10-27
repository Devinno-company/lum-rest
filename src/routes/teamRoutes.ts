import express from 'express';
import TeamController from '../controller/TeamController';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const teamRoutes = express.Router();
const controller = new TeamController();

teamRoutes.get('/events/:idEvent/team', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.readTeam(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

teamRoutes.get('/events/:idEvent/team/:idMember', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMember = request.params['idMember'];

    if (!Number(idEvent) || !Number(idMember))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.readTeamMember(user, Number(idEvent), Number(idMember))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

teamRoutes.patch('/events/:idEvent/team/:idMember', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMember = request.params['idMember'];
    const updateRoleTeamMember: { role: string } = request.body;

    if (!Number(idEvent) || !Number(idMember))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.updateRoleTeamMember(user, Number(idEvent), Number(idMember), updateRoleTeamMember.role)
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

teamRoutes.delete('/events/:idEvent/team/:idMember', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMember = request.params['idMember'];

    if (!Number(idEvent) || !Number(idMember))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.deleteTeamMember(user, Number(idEvent), Number(idMember))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default teamRoutes;
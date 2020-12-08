import express from 'express';
import DashboardController from '../controller/DashboardController';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const dashboardRoutes = express.Router();
const controller = new DashboardController();

dashboardRoutes.get('/events/:idEvent/dashboards', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.getDashboardEvent(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

dashboardRoutes.get('/events/:idEvent/dashboards/checkins', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.getDashboardCheckins(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default dashboardRoutes;
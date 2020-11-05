import express from 'express';
import TimeController from '../controller/TimeController';
import InsertTime from '../interfaces/inputRepository/insertTime';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';
import UpdateTimeRequest from '../interfaces/request/UpdateTimeRequest';

const timeRoutes = express.Router();
const controller = new TimeController();


timeRoutes.post('/events/:idEvent/times', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const insertTime: InsertTime = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.insertTime(user, Number(idEvent), insertTime)
                .then((result) => response.status(201).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


timeRoutes.get('/events/:idEvent/times/:idTime', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTime = request.params['idTime'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idTime)) {
        response.status(400).json({ message: 'Time Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.readTime(user, Number(idEvent), Number(idTime))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


timeRoutes.get('/events/:idEvent/times', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.readTimes(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


timeRoutes.put('/events/:idEvent/times/:idTime', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTime = request.params['idTime'];
    const updateTime: UpdateTimeRequest = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idTime)) {
        response.status(400).json({ message: 'Time Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.updateTime(user, updateTime, Number(idEvent), Number(idTime))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


timeRoutes.delete('/events/:idEvent/times/:idTime', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTime = request.params['idTime'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idTime)) {
        response.status(400).json({ message: 'Time Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.deleteTime(user, Number(idEvent), Number(idTime))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default timeRoutes;
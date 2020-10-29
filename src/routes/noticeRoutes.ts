import express from 'express';
import NoticeController from '../controller/NoticeController';
import NewNoticeRequest from '../interfaces/request/NewNoticeRequest';
import UpdateNoticeRequest from '../interfaces/request/UpdateNoticeRequest';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const noticeRoutes = express.Router();
const controller = new NoticeController();

noticeRoutes.get('/events/:idEvent/notices', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.readNotices(user, Number(idEvent))
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

noticeRoutes.get('/events/:idEvent/notices/:idNotice', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idNotice = request.params['idNotice'];

    if (!Number(idEvent) || !Number(idNotice))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.readNotice(user, Number(idEvent), Number(idNotice))
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

noticeRoutes.post('/events/:idEvent/notices', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const newNotice: NewNoticeRequest = request.body;

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.insertNotice(user, Number(idEvent), newNotice)
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

noticeRoutes.put('/events/:idEvent/notices/:idNotice', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idNotice = request.params['idNotice'];
    const updateNotice: UpdateNoticeRequest = request.body;

    if (!Number(idEvent) || !Number(idNotice))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.updateNotice(user, Number(idEvent), Number(idNotice), updateNotice)
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

noticeRoutes.delete('/events/:idEvent/notices/:idNotice', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idNotice = request.params['idNotice'];

    if (!Number(idEvent) || !Number(idNotice))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.deleteNotice(user, Number(idEvent), Number(idNotice))
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default noticeRoutes;
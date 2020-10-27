import NotificationController from "../controller/NotificationController";
import express, { request } from 'express';
import verifyToken from "../middleware/verifyToken";
import getUserByRequest from "../utils/getUserByRequest";
import validate from "../middleware/inputValidation";

const notificationRoutes = express.Router();
const controller = new NotificationController();

notificationRoutes.get('/notifications', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readNotifications(user)
                .then((notificationsResponse) => response.status(200).json(notificationsResponse))
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

notificationRoutes.get('/notifications/:idNotification', verifyToken, (request, response) => {
    const idNotification = request.params['idNotification'];

    if(!Number(idNotification))
        response.status(400).json({status: 400, message: 'Id invalid.'});

    getUserByRequest(request)
        .then(user => {
            controller.readNotification(user, Number(idNotification))
                .then((notification) => response.status(200).json(notification))
                .catch((err) => response.status(err.status | 400). json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/* 
    change isRead
    choice: read | unread
*/
notificationRoutes.patch('/notifications/:idNotification', verifyToken, (request, response) => {
    const idNotification = request.params['idNotification'];
    const choice = request.body.choice;

    if (!Number(idNotification))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.choiceRead(user, Number(idNotification), choice)
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

notificationRoutes.delete('/notifications/:idNotification', verifyToken, (request, response) => {
    const idNotification = request.params['idNotification'];

    if (!Number(idNotification))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.deleteNotification(user, Number(idNotification))
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default notificationRoutes;
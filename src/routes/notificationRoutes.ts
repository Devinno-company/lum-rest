import NotificationController from "../controller/NotificationController";
import express from 'express';
import verifyToken from "../middleware/verifyToken";
import getUserByRequest from "../utils/getUserByRequest";
import NotificationsMercadoPagoController from "../controller/NotificationsMercadoPagoController";

const notificationRoutes = express.Router();
const controller = new NotificationController();
const notificationsMP = new NotificationsMercadoPagoController();

/**
 * @api {get} notifications 3.1. Get all notifications from the user
 * 
 * @apiVersion 1.9.0
 * @apiGroup 3. Notifications
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiSuccess (200) {Number} id Notification identification code.
 * @apiSuccess (200) {String{3..100}} title Notification name.
 * @apiSuccess (200) {String{..255}} content Notification content.
 * @apiSuccess (200) {Boolean} isRead Is the notification read or unread.
 * @apiSuccess (200) {Object} link Notification link.
 * @apiSuccess (200) {Number} link[idItem] Identification number of the item(cd_material, cd_invite, etc.).
 * @apiSuccess (200) {String{3}} link[type] Type of the notification.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      id: 3,
 *      title: "Novo material!",
 *      content: "Material: x10 Violetas, adicionado ao evento Flores e Frutas",
 *      isRead: "false",
 *      link: {
 *          idItem: 42,
 *          type: "MTA"
 *      }
 *   }
 *   {
 *      id: 5,
 *      title: "Novo convite!",
 *      content: "Você recebeu um novo convite para participar da organização de um evento.",
 *      isRead: "true",
 *      link: {
 *          idItem: 12,
 *          type: "CVC"
 *      }
 *   }
 * 
 *  @apiError (401) {Object} noAllowed You don't have permission to do so.
 *  @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
notificationRoutes.get('/notifications', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readNotifications(user)
                .then((notificationsResponse) => response.status(200).json(notificationsResponse))
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} notifications/:idNotification 3.2. Get notification by id
 * 
 * @apiVersion 1.10.2
 * @apiGroup 3. Notifications
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idNotification Notification identification code.
 * 
 * @apiSuccess (200) {Number} id Notification identification code.
 * @apiSuccess (200) {String{3..100}} title Notification name.
 * @apiSuccess (200) {String{..255}} content Notification content.
 * @apiSuccess (200) {Boolean} isRead Is the notification read or unread.
 * @apiSuccess (200) {Object} link Notification link.
 * @apiSuccess (200) {Number} link[idItem] Identification number of the item(cd_material, cd_invite, etc.).
 * @apiSuccess (200) {String{3}} link[type] Type of the notification.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      id: 5,
 *      title: "Novo convite!",
 *      content: "Você recebeu um novo convite para participar da organização de um evento.",
 *      isRead: "true",
 *      link: {
 *          idItem: 12,
 *          type: "CVC"
 *      }
 *   }
 * 
 *  @apiError (401) {Object} noAllowed You don't have permission to do so.
 *  @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
notificationRoutes.get('/notifications/:idNotification', verifyToken, (request, response) => {
    const idNotification = request.params['idNotification'];

    if (!Number(idNotification))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.readNotification(user, Number(idNotification))
                .then((notification) => response.status(200).json(notification))
                .catch((err) => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {patch} notifications/:idNotification 3.3. Change isRead.
 * 
 * @apiVersion 1.10.2
 * @apiGroup 3. Notifications
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idNotification Notification identification code.
 * 
 * @apiParam (Request Body Params) {String} choice Notification Response. Possible values: "unread" and "read".
 * 
 * @apiExample {json} Request body
 *  {
 *      "choice": "unread"
 *  }
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 * 
 * @apiError (401) {Object} noAllowed You don't have permission to do so.
 * @apiErrorExample noAllowed
 *  HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
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

/**
 * @api {delete} notifications/:idNotification 3.4. Delete a notification
 * 
 * @apiVersion 1.10.2
 * @apiGroup 3. Notifications
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idNotification Notification identification code.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  
 * @apiError (401) {Object} noAllowed You don't have permission to do so.
 * @apiErrorExample noAllowed
 *  HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
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

notificationRoutes.get('/notifications_mercado_pago', async (request, response) => {
    notificationsMP.whatIsAction(request.body);
    response.status(200).json();
});

export default notificationRoutes;
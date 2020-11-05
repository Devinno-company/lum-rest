import express from 'express';
import NoticeController from '../controller/NoticeController';
import NewNoticeRequest from '../interfaces/request/NewNoticeRequest';
import UpdateNoticeRequest from '../interfaces/request/UpdateNoticeRequest';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const noticeRoutes = express.Router();
const controller = new NoticeController();

/**
 * @api {get} events/:idEvent/notices 8.1. Get notices
 * 
 * @apiVersion 1.13.0
 * @apiGroup 8. Notices
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 *
 * @apiSuccess (200) {Number} id Notice identification code.
 * @apiSuccess (200) {String{3..100}} name Notice title.
 * @apiSuccess (200) {String{..255}} [description] Notice description.
 * @apiSuccess (200) {Number} priority Notice priority to classification.
 * @apiSuccess (200) {Object} Urgency Notice urgency.
 * @apiSuccess (200) {Object} Urgency[name] Urgency name.
 * @apiSuccess (200) {Object} Urgency[priority] Urgency priority to classification.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   [
 *      {
 *          "id": 4,
 *          "name": "O dia está chegando",
 *          "description": "Temos trabalhado muito, agora é hora de aproveitar.",
 *          "priority": 10,
 *          "urgency": {
 *          "name": "Importante",
 *          "priority": 2
 *          }
 *      },
 *      {
 *          "id": 5,
 *          "name": "Todos os materiais foram adquiridos.",
 *          "description": "Parabéns a todos, estamos mais próximos que nunca.",
 *          "priority": 11,
 *          "urgency": {
    *          "name": "Urgente",
    *          "priority": 1
 *          }
 *      }
 *   ]
 * 
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
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


/**
 * @api {get} events/:idEvent/notices/:idNotice 8.2. Get a notice
 * 
 * @apiVersion 1.13.0
 * @apiGroup 8. Notices
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idNotice Notice identification code.
 *
 * @apiSuccess (200) {Number} id Notice identification code.
 * @apiSuccess (200) {String} name Notice title.
 * @apiSuccess (200) {String} [description] Notice description.
 * @apiSuccess (200) {Number} priority Notice priority to classification.
 * @apiSuccess (200) {Object} Urgency Notice urgency.
 * @apiSuccess (200) {Object} Urgency[name] Urgency name.
 * @apiSuccess (200) {Object} Urgency[priority] Urgency priority to classification.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      "id": "4",
 *      "name": "O dia está chegando",
 *      "description": "Temos trabalhado muito, agora é hora de aproveitar.",
 *      "priority": 10,
 *      "urgency": {
 *          "name": "Importante",
 *          "priority": 2
 *      }
 *   }
 * 
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
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

/**
 * @api {post} events/:idEvent/notices 8.3. Create a notice
 * 
 * @apiVersion 1.13.0
 * @apiGroup 8. Notices
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiParam (Request body params) {String} name Notice title.
 * @apiParam (Request body params) {String} [description] Notice description.
 * @apiParam (Request body params) {String} priority Notice the priority for classification.
 * @apiParam (Request body params) {String{3}} urgency Notice urgency. Possible values: URG(Urgente), IMP(Importante), REL(Relevante).
 *
 * @apiExample {json} Request body
 *  {
 *      "name": "O dia está chegando",
 *      "description": "Temos trabalhado muito, agora é hora de aproveitar.",
 *      "priority": 10,
 *      "urgency": "IMP"
 *  }
 * 
 * @apiSuccess (201) {Number} id Notice identification code.
 * @apiSuccess (201) {String} name Notice title.
 * @apiSuccess (201) {String} [description] Notice description.
 * @apiSuccess (201) {Number} priority Notice priority to classification.
 * @apiSuccess (201) {Object} Urgency Notice urgency.
 * @apiSuccess (201) {Object} Urgency[name] Urgency name.
 * @apiSuccess (201) {Object} Urgency[priority] Urgency priority to classification.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *   {
 *      "id": 4,
 *      "name": "O dia está chegando",
 *      "description": "Temos trabalhado muito, agora é hora de aproveitar.",
 *      "priority": 10,
 *      "urgency": {
 *          "name": "Importante",
 *          "priority": 2
 *      }
 *   }
 * 
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
noticeRoutes.post('/events/:idEvent/notices', verifyToken, validate, (request, response) => {
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

/**
 * @api {put} events/:idEvent/notices/:idNotice 8.3. Update a notice
 * 
 * @apiVersion 1.13.0
 * @apiGroup 8. Notices
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idNotice Notice identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} [name_to] New notice title.
 * @apiParam (Request body params) {String{..255}} [description_to] New notice description.
 * @apiParam (Request body params) {String{3}} [urgency_to] New notice urgency. Possible values: URG(Urgente), IMP(Importante), REL(Relevante).
 *
 * @apiExample {json} Request body
 *  {
 *      "name_to": "Estamos quase lá!"
 *  }
 * 
 * @apiSuccess (201) {Number} id Notice identification code.
 * @apiSuccess (201) {String} name Notice title.
 * @apiSuccess (201) {String} [description] Notice description.
 * @apiSuccess (201) {Number} priority Notice priority to classification.
 * @apiSuccess (201) {Object} Urgency Notice urgency.
 * @apiSuccess (201) {Object} Urgency[name] Urgency name.
 * @apiSuccess (201) {Object} Urgency[priority] Urgency priority to classification.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *   {
 *      "id": 4,
 *      "name": "Estamos quase lá",
 *      "description": "Temos trabalhado muito, agora é hora de aproveitar.",
 *      "priority": 10,
 *      "urgency": {
 *          "name": "Importante",
 *          "priority": 2
 *      }
 *   }
 * 
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
noticeRoutes.put('/events/:idEvent/notices/:idNotice', verifyToken, validate, (request, response) => {
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

/**
 * @api {delete} events/:idEvent/notices/:idNotice 8.4. Delete a notice
 * 
 * @apiVersion 1.13.0
 * @apiGroup 8. Notices
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idNotice Notice identification code.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 * 
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
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
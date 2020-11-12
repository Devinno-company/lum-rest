import express from 'express';
import TimeController from '../controller/TimeController';
import InsertTime from '../interfaces/inputRepository/insertTime';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';
import UpdateTimeRequest from '../interfaces/request/UpdateTimeRequest';

const timeRoutes = express.Router();
const controller = new TimeController();

/**
 * @api {post} events/:idEvent/times 10.1. Create time
 * 
 * @apiVersion 1.23.6
 * @apiGroup 10. Times
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} [nm_time] Time name.
 * @apiParam (Request body params) {String{3..255}} [ds_time] Time description.
 * @apiParam (Request body params) {Date} [dt_time] Time date.
 * @apiParam (Request body params) {Time} [hr_start] Time start hour and minute.
 * @apiParam (Request body params) {Time} [hr_end] Time end hour and minute.
 * 
 * @apiExample {json} Request body:
 *  {
 *     "nm_time": "Segundo dia do Evento",
 *     "ds_time": "Segundo dia do evento com as atrações: Flores e Orquideas, Tuberculos e Seus Similares",
 *     "dt_time": "2020-10-20",
 *     "hr_start": "16:00",
 *     "hr_end": "20:00"
 *  }
 * 
 * @apiSuccess (200) {Number} id Time identification code.
 * @apiSuccess (200) {String} nm_time Time name.
 * @apiSuccess (200) {String} ds_time Time description.
 * @apiSuccess (200) {Date} dt_time Time date.
 * @apiSuccess (200) {Time} hr_start Time start hour and minute.
 * @apiSuccess (200) {Time} hr_end Time end hour and minute.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      "id": "2",
 *      "nm_time": "Segundo dia do Evento",
 *      "ds_time": "Segundo dia do evento com as atrações: Flores e Orquideas, Tuberculos e Seus Similares",
 *      "dt_time": "2020-10-20",
 *      "hr_start": "16:00",
 *      "hr_end": "20:00"
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

/**
 * @api {get} events/:idEvent/times/:idTime 10.2. Get time by id
 * 
 * @apiVersion 1.23.6
 * @apiGroup 10. Times
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTime Time identification code.
 * 
 * @apiSuccess (200) {Number} id Time identification code.
 * @apiSuccess (200) {String} nm_time Time name.
 * @apiSuccess (200) {String} ds_time Time description.
 * @apiSuccess (200) {Date} dt_time Time date.
 * @apiSuccess (200) {Time} hr_start Time start hour and minute.
 * @apiSuccess (200) {Time} hr_end Time end hour and minute.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      "id": "2",
 *      "nm_time": "Segundo dia do Evento",
 *      "ds_time": "Segundo dia do evento com as atrações: Flores e Orquideas, Tuberculos e Seus Similares",
 *      "dt_time": "2020-10-20",
 *      "hr_start": "16:00",
 *      "hr_end": "20:00"
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

/**
 * @api {get} events/:idEvent/times 10.3. Get all times from event
 * 
 * @apiVersion 1.23.6
 * @apiGroup 10. Times
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiSuccess (200) {Number} id Time identification code.
 * @apiSuccess (200) {String} nm_time Time name.
 * @apiSuccess (200) {String} ds_time Time description.
 * @apiSuccess (200) {Date} dt_time Time date.
 * @apiSuccess (200) {Time} hr_start Time start hour and minute.
 * @apiSuccess (200) {Time} hr_end Time end hour and minute.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      "id": "2",
 *      "nm_time": "Segundo dia do Evento",
 *      "ds_time": "Segundo dia do evento com as atrações: Flores e Orquideas, Tuberculos e Seus Similares",
 *      "dt_time": "2020-10-20",
 *      "hr_start": "16:00",
 *      "hr_end": "20:00"
 *   }
 *   {
 *      "id": "3",
 *      "nm_time": "Terceiro dia do Evento",
 *      "ds_time": "Terceiro dia do evento com Finalização do Evento e entrega de prêmios",
 *      "dt_time": "2020-09-16",
 *      "hr_start": "12:00",
 *      "hr_end": "18:00"
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

/**
 * @api {put} events/:idEvent/times/:idTime 10.4. Update time
 * 
 * @apiVersion 1.23.6
 * @apiGroup 10. Times
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTime Time identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} [nm_time_to] New Time name.
 * @apiParam (Request body params) {String{3..255}} [ds_time_to] New Time description.
 * @apiParam (Request body params) {Date} [dt_time_to] New Time date.
 * @apiParam (Request body params) {Time} [hr_start_to] New Time start hour and minute.
 * @apiParam (Request body params) {Time} [hr_end_to] New Time end hour and minute.
 * 
 * @apiExample {json} Request body:
 *  {
 *      "nm_time_to": "Quarto dia do Evento",
 *      "ds_time_to": "Quarto dia do evento com Finalização do Evento e entrega de prêmios",
 *      "dt_time_to": "2020-08-11",
 *      "hr_start_to": "10:00",
 *      "hr_end_to": "22:00"
 *  }
 * 
 * @apiSuccess (200) {Number} id Time identification code.
 * @apiSuccess (200) {String} nm_time Time name.
 * @apiSuccess (200) {String} ds_time Time description.
 * @apiSuccess (200) {Date} dt_time Time date.
 * @apiSuccess (200) {Time} hr_start Time start hour and minute.
 * @apiSuccess (200) {Time} hr_end Time end hour and minute.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 200 OK
 *   {
 *      "id": "3",
 *      "nm_time": "Quarto dia do Evento",
 *      "ds_time": "Quarto dia do evento com Finalização do Evento e entrega de prêmios",
 *      "dt_time": "2020-08-11",
 *      "hr_start": "11:00",
 *      "hr_end": "22:00"
 *   }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 * @apiError (400) noField No field need be updated.
 * @apiErrorExample noField:
 *  HTTPS/1.1 400 Bad Request
 *      { 
 *          status: 400, 
 *          message: 'No field to update' 
 *      }
 * 
 * @apiError (401) {Object} noAllowed You don't have permission to do so.
 * @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 */
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

/**
 * @api {delete} events/:idEvent/times/:idTime 10.5. Delete a Material
 * 
 * @apiVersion 1.23.6
 * @apiGroup 10. Times
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTime Time identification code.
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
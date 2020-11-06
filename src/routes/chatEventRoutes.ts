import express from 'express';
import ChatEventController from '../controller/ChatEventController';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const chatEventRoutes = express.Router();
const controller = new ChatEventController();

/**
 * @api {get} events/:idEvent/chats 12.2. Get all chats from the event
 * 
 * @apiVersion 1.10.2
 * @apiGroup 12. Event chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiSuccess (201) {Number} id Chat id.
 * @apiSuccess (201) {Number} event_id Event Code of the event you are supporting.
 * @apiSuccess (201) {Number} user_id User code that is contacting the event.
 * @apiSuccess (201) {Object[]} messages Conversation message array.
 * @apiSuccess (201) {Number} messages[id] Message identification code.
 * @apiSuccess (201) {Number} messages[message] Message text.
 * @apiSuccess (201) {String} messages[sended_at] Message timestamp.
 * @apiSuccess (201) {Object} author Information about the author of the message that may be the event or the user.
 * @apiSuccess (201) {Number} author[id] Author identification code.
 * @apiSuccess (201) {String} author[type] Tells you if the author is the user or the event.If the event is the value returned is "EVT" if the user is the value is "USR"
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *  [
 *   {
 *      "id": 2,
 *      "user_id": 1,
 *      "event_id": 1,
 *      "messages": [
 *          {
 *              "id": 4,
 *              "message": "olá, bom dia",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
 *              },
 *              "sended_at": "2020-11-06T16:54:43.396Z"
 *          },
 *          {
 *              "id": 5,
 *              "message": "Preciso de ajuda",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
 *              },
 *              "sended_at": "2020-11-06T16:55:00.396Z"
 *          }
 *      ]
 *   },
 *   {    
 *      "id": 3,
 *      "user_id": 2,
 *      "event_id": 1,
 *      "messages": [
 *          {
 *              "id": 6,
 *              "message": "olá, bom dia",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
 *              },
 *              "sended_at": "2020-11-06T16:54:43.396Z"
 *          },
 *          {
 *              "id": 7,
 *              "message": "No que podemos ajudar?",
 *              "author": {
 *                  "id": 1,
 *                  "type": "EVT"
 *              },
 *              "sended_at": "2020-11-06T16:55:00.396Z"
 *          }
 *      ]
 *   }
 *  ]
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
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

/**
 * @api {get} events/:idEvent/chats/:idChat 12.3. Get a chat
 * 
 * @apiVersion 1.10.2
 * @apiGroup 12. Event chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idChat Chat identification code.
 * 
 * @apiSuccess (200) {Number} id Chat id.
 * @apiSuccess (200) {Number} event_id Event Code of the event you are supporting.
 * @apiSuccess (200) {Number} user_id User code that is contacting the event.
 * @apiSuccess (200) {Object[]} messages Conversation message array.
 * @apiSuccess (200) {Number} messages[id] Message identification code.
 * @apiSuccess (200) {Number} messages[message] Message text.
 * @apiSuccess (200) {String} messages[sended_at] Message timestamp.
 * @apiSuccess (200) {Object} author Information about the author of the message that may be the event or the user.
 * @apiSuccess (200) {Number} author[id] Author identification code.
 * @apiSuccess (200) {String} author[type] Tells you if the author is the user or the event.If the event is the value returned is "EVT" if the user is the value is "USR"
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *   {    
 *      "id": 3,
 *      "user_id": 1,
 *      "event_id": 2,
 *      "messages": [
 *          {
 *              "id": 6,
 *              "message": "olá, bom dia",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
 *              },
 *              "sended_at": "2020-11-06T16:54:43.396Z"
 *          },
 *          {
 *              "id": 7,
 *              "message": "No que podemos ajudar?",
 *              "author": {
 *                  "id": 2,
 *                  "type": "EVT"
 *              },
 *              "sended_at": "2020-11-06T16:55:00.396Z"
 *          }
 *      ]
 *   }
 * 
 * @apiError (404) chatNotFound This chat doen'st exists
 * @apiErrorExample chatNotFound
 *  HTTPS/1.1 404 Not found
 *  {
 *      "status": 404,
 *      "message": "This chat doesn't exists"
 *  }
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
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

/**
 * @api {post} events/:idEvent/chats/:idChat 12.1. Send a message
 * 
 * @apiVersion 1.10.2
 * @apiGroup 12. Event chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idChat Chat identification code.
 * 
 * @apiParam (Request body Params) {String} message Message text.
 * 
 * @apiExample {json} Request body
 *  {
 *      "message": "No que podemos ajudar?"
 *  }
 * 
 * @apiSuccess (201) {Number} id Chat id.
 * @apiSuccess (201) {Number} event_id Event Code of the event you are supporting.
 * @apiSuccess (201) {Number} user_id User code that is contacting the event.
 * @apiSuccess (201) {Object[]} messages Conversation message array.
 * @apiSuccess (201) {Number} messages[id] Message identification code.
 * @apiSuccess (201) {Number} messages[message] Message text.
 * @apiSuccess (201) {String} messages[sended_at] Message timestamp.
 * @apiSuccess (201) {Object} author Information about the author of the message that may be the event or the user.
 * @apiSuccess (201) {Number} author[id] Author identification code.
 * @apiSuccess (201) {String} author[type] Tells you if the author is the user or the event.If the event is the value returned is "EVT" if the user is the value is "USR"
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *   {
 *      "id": 2,
 *      "user_id": 1,
 *      "event_id": 1,
 *      "messages": [
 *          {
 *              "id": 4,
 *              "message": "olá, bom dia",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
 *              },
 *              "sended_at": "2020-11-06T16:54:43.396Z"
 *          },
 *          {
 *              "id": 5,
 *              "message": "No que podemos ajudar?",
 *              "author": {
 *                  "id": 1,
 *                  "type": "EVT"
 *              },
 *              "sended_at": "2020-11-06T16:55:00.396Z"
 *          }
 *      ]
 *   }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
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
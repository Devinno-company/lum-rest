import express from 'express';
import ChatUserController from '../controller/ChatUserController';
import NewChatRequest from '../interfaces/request/NewChatRequest';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const chatUserRoutes = express.Router();
const controller = new ChatUserController();

/**
 * @api {post} newChat 11.1. Start a chat with a event
 * 
 * @apiVersion 1.10.2
 * @apiGroup 11. Chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Request body Params) {Number} event_id Identification code of the event that will start the chat
 * @apiParam (Request body Params) {String} message First message of the conversation
 * 
 * @apiExample {json} Request body
 *  {
 *      "event_id": 1,
 *      "message": "Olá, bom dia"
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
 *          }
 *      ]
 *   }
 *  
 * @apiError (401) {Object} eventPrivate Can't send messages to private events
 * @apiErrorExample eventPrivate
 *  HTTPS/1.1 401 Unauthorized
 *      { 
 *          "status": 401, 
 *          "message": "Can't send messages to private events" 
 *      }
 * 
 * @apiError (400) {Object} chatExists This chat already created
 * @apiErrorExample chatExists
 *  HTTPS/1.1 400 Bad request
 *      { 
 *          "status": 400, 
 *          "message": "This chat already created" 
 *      }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
chatUserRoutes.post('/newChat', verifyToken, validate, (request, response) => {
    const newChat: NewChatRequest = request.body

    getUserByRequest(request)
        .then(user =>
            controller.newChat(user, newChat.event_id, newChat.message)
                .then((result) => response.status(201).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

/**
 * @api {post} chats/:idChat 11.2. Send a message
 * 
 * @apiVersion 1.10.2
 * @apiGroup 11. Chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idChat Chat identification code.
 * 
 * @apiParam (Request body Params) {String} message Message text.
 * 
 * @apiExample {json} Request body
 *  {
 *      "message": "Preciso de ajuda"
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
 *              "message": "Preciso de ajuda",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
 *              },
 *              "sended_at": "2020-11-06T16:55:00.396Z"
 *          }
 *      ]
 *   }
 *  
 * @apiError (401) {Object} eventPrivate Can't send messages to private events
 * @apiErrorExample eventPrivate
 *  HTTPS/1.1 401 Unauthorized
 *      { 
 *          "status": 401, 
 *          "message": "Can't send messages to private events" 
 *      }
 * 
 * @apiError (400) {Object} chatExists This chat already created
 * @apiErrorExample chatExists
 *  HTTPS/1.1 400 Bad request
 *      { 
 *          "status": 400, 
 *          "message": "This chat already created" 
 *      }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
chatUserRoutes.post('/chats/:idChat', verifyToken, validate, (request, response) => {
    const idChat = request.params['idChat'];
    const newMessage: { message: string } = request.body;

    if (!Number(idChat))
        response.status(400).json({ status: 400, message: 'Chat id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.insertMessage(user, Number(idChat), newMessage.message)
                .then((result) => response.status(201).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} chats 11.3. Get all chats from the user
 * 
 * @apiVersion 1.10.2
 * @apiGroup 11. Chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
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
 *              "message": "Preciso de ajuda",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
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
chatUserRoutes.get('/chats', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user =>
            controller.readChats(user)
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} chats/:idChat 11.4. Get a chat
 * 
 * @apiVersion 1.10.2
 * @apiGroup 11. Chat
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idChat Chat identification code.
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
 *              "message": "Preciso de ajuda",
 *              "author": {
 *                  "id": 1,
 *                  "type": "USR"
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
chatUserRoutes.get('/chats/:idChat', verifyToken, (request, response) => {
    const idChat = request.params['idChat'];

    if (!Number(idChat))
        response.status(400).json({ status: 400, message: 'Chat id invalid.' });

    getUserByRequest(request)
        .then(user =>
            controller.readChat(user, Number(idChat))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err))
        )
        .catch((err) => response.status(err.status || 400).json(err));
});

export default chatUserRoutes;
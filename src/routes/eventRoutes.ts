import express from 'express';
import EventController from '../controller/EventController';
import NewEvent from '../interfaces/request/NewEvent';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const eventRoutes = express.Router();
const controller = new EventController();

/**
 * @api {post} events 3.1. Create event
 * 
 * @apiVersion 1.5.2
 * @apiGroup 3. Events
 * 
 * @apiParam (Request body params) {String{3..100}} name Event name.
 * @apiParam (Request body params) {Date} start_date Start date of the event. (Format: yyyy-mm-dd).
 * @apiParam (Request body params) {Date} end_date End date of the event. (Format: yyyy-mm-dd).
 * @apiParam (Request body params) {String{..255}} [description] Event description.
 * @apiParam (Request body params) {Time} [start_time] Start time of the event. (Format: hh:mm).
 * @apiParam (Request body params) {Time} [end_time] End time of the event. (Format: hh:mm).
 * @apiParam (Request body params) {String{0..100}} [type] Event type.
 * @apiParam (Request body params) {Object} location Event location.
 * @apiParam (Request body params) {String{3}} privacy Event privacy.
 * @apiParam (Request body params) {String{3}} category Event category.
 * @apiParam (Request body params) {String{3..120}} location[street] Event street.
 * @apiParam (Request body params) {String{3..100}} location[neighborhood] Event neighborhood.
 * @apiParam (Request body params) {Number} location[number] Event establishment number
 * @apiParam (Request body params) {String{8}} location[cep] Event zip code. (Only numbers).
 * @apiParam (Request body params) {String{0..100}} [location[complement]] Additional event location information.
 * @apiParam (Request body params) {String{3..100}} location[city] Location Event city.
 * @apiParam (Request body params) {String{2}} location[uf] Event federative unit. (uppercase).
 * @apiParam (Request body params) {Object} location[geolocation] Event geolocation.
 * @apiParam (Request body params) {Number} geolocation[latitude] Event latitude.
 * @apiParam (Request body params) {Object} geolocation[longitude] Event longitude.
 * 
 * @apiExample {json} Request body
 *  {
 *      "name": "Flores e frutas",
 *      "start_date": "2020-10-22",
 *      "end_date": "2020-10-25",
 *      "description": "Venha participar do maior evento sobre flores e frutas da América Latina.",
 *      "start_time": "15:00",
 *      "end_time": "20:00",
 *      "privacy": "PUB",
 *      "category": "NAT"
 *      "location": {
 *          "street": "Rua rubi",
 *          "neighborhood": "Cidade da criança",
 *          "number": 202,
 *          "cep": "11710210",
 *          "complement": "Espaço B",
 *          "geolocation": {
 *               "latitude": 1.534,
 *               "longitude": 3.123
 *          },
 *          "city": "Praia Grande",
 *          "uf": "SP"
 *      }
 *  }
 * 
 * @apiSuccess (200) {Number} id Event identification code.
 * @apiSuccess (200) {String{3..100}} name Event name.
 * @apiSuccess (200) {Date} start_date Start date of the event. (Format: yyyy-mm-dd).
 * @apiSuccess (200) {Date} end_date End date of the event. (Format: yyyy-mm-dd).
 * @apiSuccess (200) {String{..255}} [description] Event description.
 * @apiSuccess (200) {Time} [start_time] Start time of the event. (Format: hh:mm).
 * @apiSuccess (200) {Time} [end_time] End time of the event. (Format: hh:mm).
 * @apiSuccess (200) {String{0..100}} [type] Event type.
 * @apiSuccess (200) {Object} location Event location.
 * @apiSuccess (200) {String{3}} privacy Event privacy.
 * @apiSuccess (200) {String{3}} category Event category.
 * @apiSuccess (200) {String{3..120}} location[street] Event street.
 * @apiSuccess (200) {String{3..100}} location[neighborhood] Event neighborhood.
 * @apiSuccess (200) {Number} location[number] Event establishment number
 * @apiSuccess (200) {String{8}} location[cep] Event zip code. (Only numbers).
 * @apiSuccess (200) {String{0..100}} [location[complement]] Additional event location information.
 * @apiSuccess (200) {String{3..100}} location[city] Location Event city.
 * @apiSuccess (200) {String{2}} location[uf] Event federative unit. (uppercase).
 * @apiSuccess (200) {Object} location[geolocation] Event geolocation.
 * @apiSuccess (200) {Number} geolocation[latitude] Event latitude.
 * @apiSuccess (200) {Object} geolocation[longitude] Event longitude.
 * @apiSuccess (200) {Object[user]} team Users responsible for organizing the event.
 * @apiSuccess (200) {Number} team[id] User identification code.
 * @apiSuccess (200) {String} team[name] User name.
 * @apiSuccess (200) {String} team[surname] User surname.
 * @apiSuccess (200) {String} team[image] User image
 * @apiSuccess (200) {Object} team[role] User name.
 * @apiSuccess (200) {String} role[name] Role name.
 * @apiSuccess (200) {String} role[description] Role description.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *  {
 *       "name": "Flores e frutas",
 *       "start_date": "2020-10-22",
 *       "end_date": "2020-10-25",
 *       "description": "Venha participar do maior evento sobre flores e frutas da América Latina.",
 *       "start_time": "15:00",
 *       "end_time": "20:00",
 *       "privacy": "PUB",
 *       "category": "NAT"
 *       "location": {
 *           "street": "Rua rubi",
 *           "neighborhood": "Cidade da criança",
 *           "number": 202,
 *           "cep": "11710210",
 *           "complement": "Espaço B",
 *           "geolocation": {
 *                "latitude": 1.534,
 *                "longitude": 3.123,
 *           },
 *           "city": "Praia Grande",
 *           "uf": "SP"
 *       },
 *       "team": [
 *          {
 *              "id": 1,
 *              "name": "João",
 *              "surname": "Silva",
 *              "image": null,
 *              "role": {
 *                  "name": "Criador",
 *                  "description": "Responsável pela criação e toda organização do evento."
 *           },
 *           {
 *              "id": 2,
 *              "name": "Marcos",
 *              "surname": "Oliveira",
 *              "image": "https://www.images.com/2",
 *              "role": {
 *                  "name": "Coordenador",
 *                  "description": "Responsável por auxiliar o criador a organizar o evento."
 *           },
 *           {
 *              "id": 3,
 *              "name": "Fernanda",
 *              "surname": "Oliveira",
 *              "image": "https://www.images.com/4",
 *              "role": {
 *                  "name": "Membro da equipe",
 *                  "description": "Responsável por realizar as tarefas atribuídas a ele."
 *           }
 *        ]
 *   }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
eventRoutes.post('/events', verifyToken, validate, async (request, response) => {
    const newEvent: NewEvent = request.body;

    getUserByRequest(request)
        .then(user => {
            controller.insertEvent(newEvent, user)
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {post} events/:id 3.1. Get event
 * 
 * @apiVersion 1.5.2
 * @apiGroup 3. Events
 * 
 * @apiParam (Path Params) {Number} id Event identification code.
 * 
 * @apiSuccess (200) {Number} id Event identification code.
 * @apiSuccess (200) {String{3..100}} name Event name.
 * @apiSuccess (200) {Date} start_date Start date of the event. (Format: yyyy-mm-dd).
 * @apiSuccess (200) {Date} end_date End date of the event. (Format: yyyy-mm-dd).
 * @apiSuccess (200) {String{..255}} [description] Event description.
 * @apiSuccess (200) {Time} [start_time] Start time of the event. (Format: hh:mm).
 * @apiSuccess (200) {Time} [end_time] End time of the event. (Format: hh:mm).
 * @apiSuccess (200) {String{0..100}} [type] Event type.
 * @apiSuccess (200) {Object} location Event location.
 * @apiSuccess (200) {String{3}} privacy Event privacy.
 * @apiSuccess (200) {String{3}} category Event category.
 * @apiSuccess (200) {String{3..120}} location[street] Event street.
 * @apiSuccess (200) {String{3..100}} location[neighborhood] Event neighborhood.
 * @apiSuccess (200) {Number} location[number] Event establishment number
 * @apiSuccess (200) {String{8}} location[cep] Event zip code. (Only numbers).
 * @apiSuccess (200) {String{0..100}} [location[complement]] Additional event location information.
 * @apiSuccess (200) {String{3..100}} location[city] Location Event city.
 * @apiSuccess (200) {String{2}} location[uf] Event federative unit. (uppercase).
 * @apiSuccess (200) {Object} location[geolocation] Event geolocation.
 * @apiSuccess (200) {Number} geolocation[latitude] Event latitude.
 * @apiSuccess (200) {Object} geolocation[longitude] Event longitude.
 * @apiSuccess (200) {Object[user]} team Users responsible for organizing the event.
 * @apiSuccess (200) {Number} team[id] User identification code.
 * @apiSuccess (200) {String} team[name] User name.
 * @apiSuccess (200) {String} team[surname] User surname.
 * @apiSuccess (200) {String} team[image] User image
 * @apiSuccess (200) {Object} team[role] User name.
 * @apiSuccess (200) {String} role[name] Role name.
 * @apiSuccess (200) {String} role[description] Role description.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *  {
 *       "name": "Flores e frutas",
 *       "start_date": "2020-10-22",
 *       "end_date": "2020-10-25",
 *       "description": "Venha participar do maior evento sobre flores e frutas da América Latina.",
 *       "start_time": "15:00",
 *       "end_time": "20:00",
 *       "privacy": "PUB",
 *       "category": "NAT"
 *       "location": {
 *           "street": "Rua rubi",
 *           "neighborhood": "Cidade da criança",
 *           "number": 202,
 *           "cep": "11710210",
 *           "complement": "Espaço B",
 *           "geolocation": {
 *                "latitude": 1.534,
 *                "longitude": 3.123,
 *           },
 *           "city": "Praia Grande",
 *           "uf": "SP"
 *       },
 *       "team": [
 *          {
 *              "id": 1,
 *              "name": "João",
 *              "surname": "Silva",
 *              "image": null,
 *              "role": {
 *                  "name": "Criador",
 *                  "description": "Responsável pela criação e toda organização do evento."
 *           },
 *           {
 *              "id": 2,
 *              "name": "Marcos",
 *              "surname": "Oliveira",
 *              "image": "https://www.images.com/2",
 *              "role": {
 *                  "name": "Coordenador",
 *                  "description": "Responsável por auxiliar o criador a organizar o evento."
 *           },
 *           {
 *              "id": 3,
 *              "name": "Fernanda",
 *              "surname": "Oliveira",
 *              "image": "https://www.images.com/4",
 *              "role": {
 *                  "name": "Membro da equipe",
 *                  "description": "Responsável por realizar as tarefas atribuídas a ele."
 *           }
 *        ]
 *   }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
eventRoutes.get('/events/:idEvent', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.readEvent(Number(idEvent), user)
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
})

export default eventRoutes;
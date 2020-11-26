import express, { request } from 'express';
import EventController from '../controller/EventController';
import NewEvent from '../interfaces/request/NewEvent';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';
import UpdateEvent from "../interfaces/request/UpdateEventRequest";
import EventResponse from '../interfaces/response/EventResponse';
import multer from 'multer';

const eventRoutes = express.Router();
const controller = new EventController();
const formData = multer();

/**
 * @api {post} events 5.1. Create event
 * 
 * @apiVersion 1.31.0
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
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
 *      "category": "NAT",
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
 * @api {get} events/:id 5.2. Get event by id
 * 
 * @apiVersion 1.5.2
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
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
 * @apiSuccess (200) {Number} geolocation[longitude] Event longitude.
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
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
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
});

/**
 * @api {get} events/:id 5.2. Get user events
 * 
 * @apiVersion 1.5.2
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
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
 * @apiSuccess (200) {Number} geolocation[longitude] Event longitude.
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
 *  [
 *      {
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
 *      },
 *      {
 *       "name": "Doces da baixada santista",
 *       "start_date": "2020-11-10",
 *       "end_date": "2020-11-12",
 *       "description": "Venha participar do maior evento de doces de toda baixada santista.",
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
 *           }
 *        ]
 *      }
 *  ]
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
eventRoutes.get('/events', verifyToken, async (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readEvents(user)
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {put} events/:id 5.3. Update event
 * 
 * @apiVersion 1.7.0
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Request body params) {String{3..100}} [name_to] New event name.
 * @apiParam (Request body params) {Date} [start_date_to] New start date of the event. (Format: yyyy-mm-dd).
 * @apiParam (Request body params) {Date} [end_date_to] New end date of the event. (Format: yyyy-mm-dd).
 * @apiParam (Request body params) {String{..255}} [description_to] New event description.
 * @apiParam (Request body params) {Time} [start_time_to] New start time of the event. (Format: hh:mm).
 * @apiParam (Request body params) {Time} [end_time_to] New end time of the event. (Format: hh:mm).
 * @apiParam (Request body params) {String{0..100}} [type_to] New event type.
 * @apiParam (Request body params) {Object} [location_to] New event location.
 * @apiParam (Request body params) {String{3..120}} location[street_to] New event street.
 * @apiParam (Request body params) {String{3..100}} location[neighborhood_to] New event neighborhood.
 * @apiParam (Request body params) {Number} location[number_to] New event establishment number
 * @apiParam (Request body params) {String{8}} location[cep_to] New event zip code. (Only numbers).
 * @apiParam (Request body params) {String{0..100}} [location[complement_to]] New additional event location information.
 * @apiParam (Request body params) {String{3..100}} location[city] New location Event city.
 * @apiParam (Request body params) {String{2}} location[uf] New event federative unit. (uppercase).
 * @apiParam (Request body params) {Object} location[geolocation] New event geolocation.
 * @apiParam (Request body params) {Number} geolocation[latitude] New event latitude.
 * @apiParam (Request body params) {Number} geolocation[longitude] New event longitude.
 * @apiParam (Request body params) {String{3}} [privacy_to] New event privacy.
 * @apiParam (Request body params) {String{3}} [category_to] New event category.
 * 
 * @apiExample {json} Request body:
 *  
 * {
 *      "name_to": "Árvores e Legumes",
 *      "start_date_to": "2020-10-25",
 *      "end_date_to": "2020-11-05",
 *      "description_to": "Venha participar do maior evento sobre árvores e legumes da América Latina.",
 *      "start_time_to": "16:00",
 *      "end_time_to": "23:00",
 *      "type_to": "",
 *      "location_to": {
 *          "street_to": "Avenida Kennedy",
 *          "neighborhood_to": "Guilhermina",
 *          "complement_to": "Apartamento 220",
 *          "number_to": 999,
 *          "cep_to": 11111222,
 *          "uf": "SP",
 *          "city": "Praia Grande",
 *          "geolocation": {
 *              "latitude": -100.0111,
 *              "longitude": 90.3245
 *          },
 *      "privacy_to": "PRI",
 *      "category_to": "REL" 
 * }
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
 * @apiSuccess (200) {String{3..120}} location[street] Event street.
 * @apiSuccess (200) {String{3..100}} location[neighborhood] Event neighborhood.
 * @apiSuccess (200) {Number} location[number] Event establishment number
 * @apiSuccess (200) {String{8}} location[cep] Event zip code. (Only numbers).
 * @apiSuccess (200) {String{0..100}} [location[complement]] Additional event location information.
 * @apiSuccess (200) {String{3..100}} location[city] Location Event city.
 * @apiSuccess (200) {String{2}} location[uf] Event federative unit. (uppercase).
 * @apiSuccess (200) {Object} location[geolocation] Event geolocation.
 * @apiSuccess (200) {Number} geolocation[latitude] Event latitude.
 * @apiSuccess (200) {Number} geolocation[longitude] Event longitude.
 * @apiSuccess (200) {String{3}} privacy Event privacy. Possible values: "PUB" (public) and "PRI" (private).
 * @apiSuccess (200) {String{3}} category Event category.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 200 OK
 *   {
 *       "name": "Árvores e Legumes",
 *       "start_date": "2020-10-25",
 *       "end_date": "2020-11-05",
 *       "description": "Venha participar do maior evento sobre árvores e vegumes da América Latina.",
 *       "start_time": "16:00",
 *       "end_time": "23:00",
 *       "privacy": "PRI",
 *       "category": "REL",
 *       "location": {
 *           "street": "Avenida Kennedy",
 *           "neighborhood": "Guilhermina",
 *           "number": 999,
 *           "cep": "11111222",
 *           "complement": "Apartamento 220",
 *           "geolocation": {
 *                "latitude": -100.0111,
 *                "longitude": 90.3245
 *           },
 *           "city": "Praia Grande",
 *           "uf": "SP"
 *       }
 * }
 * 
 * @apiUse eventNotFoundError
 * @apiUse eventNotFoundErrorExample
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
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
 */
eventRoutes.put('/events/:idEvent', verifyToken, validate, (request, response) => {
    const idEvent = request.params['idEvent'];
    const updateEvent: UpdateEvent = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request).then(user => {
        controller.updateEvent(user, updateEvent, Number(idEvent))
            .then((result: EventResponse) => response.status(200).json(result))
            .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} events/:id 5.4. Delete event
 * 
 * @apiVersion 1.6.3
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} id Event identification code.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  
 * @apiUse eventNotFoundError
 * @apiUse eventNotFoundErrorExample
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
eventRoutes.delete('/events/:idEvent', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.deleteEvent(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {patch} events/:idEvent/quit 5.5. Exit the event
 * 
 * @apiVersion 1.12.0
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} id Event identification code.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 * 
 * @apiUse eventNotFoundError
 * @apiUse eventNotFoundErrorExample
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
eventRoutes.patch('/events/:idEvent/quit', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const { id_newCreator } = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.quitEvent(user, Number(idEvent), Number(id_newCreator))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

eventRoutes.get('/get_code_mercado_pago', (request, response) => {
    const authorization_code = request.query.code as string;
    const random_id = request.query.state as string;

    if (!authorization_code)
        response.status(400).json({ status: 400, message: 'Authotization code is required' })
    if (!random_id)
        response.status(400).json({ status: 400, message: 'Id is required' })

    controller.getLinkMercadoPagoAccount(authorization_code, random_id)
        .then(() => response.status(201).json())
        .catch((err) => response.status(err.status || 400).json(err));
});

/**
 * @api {patch} events/:idEvent/link_mercado_pago 5.6. Link the event with Mercado Pago to receive payments
 * 
 * @apiVersion 1.30.1
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} id Event identification code.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 201 OK
 * 
 * @apiUse eventNotFoundError
 * @apiUse eventNotFoundErrorExample
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
eventRoutes.post('/events/:idEvent/link_mercado_pago', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Id invalid' });

    getUserByRequest(request)
        .then((user) => {
            controller.linkMercadoPagoAccount(user, Number(idEvent))
                .then((result) => response.status(201).json({link: result}))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err) => response.status(err.status || 400).json(err));
});

/**
 * @api {post} events/:idEvent/banner 5.6. Upload the event banner
 * 
 * @apiVersion 1.31.0
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} id Event identification code.
 * @apiParam (Form data params) {image} banner Event banner.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 * 
 * @apiUse eventNotFoundError
 * @apiUse eventNotFoundErrorExample
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
eventRoutes.post('/events/:idEvent/banner', verifyToken, formData.single('banner'), (request, response) => {
    const idEvent = request.params['idEvent'];
    const banner = request.file;

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Id invalid' });
    if (!banner)
        response.status(400).json({ status: 400, message: 'Ther banner field in form data is required' });

    getUserByRequest(request)
        .then((user) => {
            controller.uploadBanner(user, Number(idEvent), banner)
                .then((result) => response.status(201).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} events/:idEvent/banner 5.6. Remove the event banner
 * 
 * @apiVersion 1.31.0
 * @apiGroup 5. Events
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} id Event identification code.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 * 
 * @apiUse eventNotFoundError
 * @apiUse eventNotFoundErrorExample
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
eventRoutes.delete('/events/:idEvent/banner', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Id invalid' });

    getUserByRequest(request)
        .then((user) => {
            controller.removeBanner(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err) => response.status(err.status || 400).json(err));
});

eventRoutes.get('/search_events', verifyToken, (request, response) => {
    const name = request.query.name;
    const city = request.query.city;
    const uf = request.query.uf;
    const distance = request.query.distance;

    if (name != 'undefined' && !String(name))
        response.status(400).json({ status: 400, message: 'Name invalid' });
    if (city != 'undefined' && !String(city))
        response.status(400).json({ status: 400, message: 'City invalid' });
    if (uf != 'undefined' && !String(uf))
        response.status(400).json({ status: 400, message: 'UF invalid' });

    getUserByRequest(request)
        .then(user => {
            controller.searchEvent(user, String(name), String(uf), String(city), Number(distance))
                .then(result => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => { response.status(err.status || 400).json(err) })
});

eventRoutes.get('/events/:idEvent/checkin', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTicket = request.query.ticket_id;
    const token = request.query.token;

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid' });
    if (!Number(idTicket))
        response.status(400).json({ status: 400, message: 'Ticket id invalid' });
    if (!String(token))
        response.status(400).json({ status: 400, message: 'Token invalid' });

    getUserByRequest(request)
        .then((user) => {
            controller.checkin(user, Number(idEvent), Number(idTicket), String(token))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err) => response.status(err.status || 400).json(err));
});

export default eventRoutes;
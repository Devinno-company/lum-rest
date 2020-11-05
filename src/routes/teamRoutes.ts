import express from 'express';
import TeamController from '../controller/TeamController';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const teamRoutes = express.Router();
const controller = new TeamController();

/**
 * @api {get} events/:idEvent/team 6.1. Get team
 * 
 * @apiVersion 1.10.0
 * @apiGroup 6. Team
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event idetification code.
 * 
 * @apiSuccess (200) {Number} team[id] User identification code.
 * @apiSuccess (200) {String} team[name] User name.
 * @apiSuccess (200) {String} team[surname] User surname.
 * @apiSuccess (200) {String} team[image] User image
 * @apiSuccess (200) {Object} team[role] User name.
 * @apiSuccess (200) {String} role[name] Role name.
 * @apiSuccess (200) {String} role[description] Role description.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *  [
 *      {
 *          "id": 1,
 *          "name": "João",
 *          "surname": "Silva",
 *          "image": null,
 *          "role": {
 *              "name": "Criador",
 *              "description": "Responsável pela criação e toda organização do evento."
 *       },
 *       {
 *          "id": 2,
 *          "name": "Marcos",
 *          "surname": "Oliveira",
 *          "image": "https://www.images.com/2",
 *          "role": {
 *              "name": "Coordenador",
 *              "description": "Responsável por auxiliar o criador a organizar o evento."
 *       },
 *       {
 *          "id": 3,
 *          "name": "Fernanda",
 *          "surname": "Oliveira",
 *          "image": "https://www.images.com/4",
 *          "role": {
 *              "name": "Membro da equipe",
 *              "description": "Responsável por realizar as tarefas atribuídas a ele."
 *       }
 *  ]
 * 
 *  @apiError (404) eventNotFound This event doesn't exists.
 *  @apiErrorExample eventNotFound
 *      HTTPS/1.1 404 Not found
 *      { 
 *          "status": 404, 
 *          "message": "This event doesn't exists" 
 *      }
 *      
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 */
teamRoutes.get('/events/:idEvent/team', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.readTeam(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} events/:idEvent/team/:idMember 6.2. Get a team member
 * 
 * @apiVersion 1.10.0
 * @apiGroup 6. Team
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMember Team member identification code.
 * 
 * @apiSuccess (200) {Number} team[id] User identification code.
 * @apiSuccess (200) {String} team[name] User name.
 * @apiSuccess (200) {String} team[surname] User surname.
 * @apiSuccess (200) {String} team[image] User image
 * @apiSuccess (200) {Object} team[role] User name.
 * @apiSuccess (200) {String} role[name] Role name.
 * @apiSuccess (200) {String} role[description] Role description.
 * 
 * @apiSuccessExample Success Response
 *  HTTPS/1.1 200 Ok
 *  {
 *      "id": 1,
 *      "name": "João",
 *      "surname": "Silva",
 *      "image": null,
 *      "role": {
 *          "name": "Criador",
 *          "description": "Responsável pela criação e toda organização do evento."
 *      }
 *  }
 * 
 *  @apiError (404) eventNotFound This event doesn't exists
 *  @apiErrorExample eventNotFound
 *      HTTPS/1.1 404 Not found
 *      { 
 *          "status": 404, 
 *          "message": "This event doesn't exists" 
 *      }
 * 
 *  @apiError (404) teamMemberNotFound This user is not on the organization team for this event.
 *  @apiErrorExample teamMemberNotFound
 *      HTTPS/1.1 404 Not found
 *      { 
 *          "status": 404, 
 *          "message": 'This user is not on the organization team for this event' 
 *      }
 *      
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 */
teamRoutes.get('/events/:idEvent/team/:idMember', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMember = request.params['idMember'];

    if (!Number(idEvent) || !Number(idMember))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.readTeamMember(user, Number(idEvent), Number(idMember))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


/**
 * @api {patch} events/:idEvent/team/:idMember 6.3. Update team member role
 * 
 * @apiVersion 1.10.0
 * @apiGroup 6. Team
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMember Team member identification code.
 * 
 * @apiExample Request Body
 *  {
 *      "role_to": "EQP"
 *  }
 * 
 * @apiParam (Request Body Params) {String} role_to New user role in event. Possible values: "COO"(coordinator) and "EQP"("Team member").
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *  {
 *      "id": 3,
 *      "name": "Fernanda",
 *      "surname": "Oliveira",
 *      "image": "https://www.images.com/4",
 *      "role": {
 *          "name": "Membro da equipe",
 *          "description": "Responsável por realizar as tarefas atribuídas a ele."
 *      }
 *  }
 * 
 * @apiError (400) selfDelete You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit.
 * @apiErrorExample selfDelete
 *  HTTPS/1.1 400 Bad request
 *  { 
 *      "status": 400, 
 *      "message": "You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit" 
 *  }
 *
 * @apiError (404) eventNotFound This event doesn't exists
 * @apiErrorExample eventNotFound
 *  HTTPS/1.1 404 Not found
 *  { 
 *      "status": 404, 
 *      "message": "This event doesn't exists" 
 *  }
 *
 * @apiError (404) teamMemberNotFound This user is not on the organization team for this event.
 * @apiErrorExample teamMemberNotFound
 *  HTTPS/1.1 404 Not found
 *  { 
 *      "status": 404, 
 *      "message": 'This user is not on the organization team for this event' 
 *  }
 *
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 */
teamRoutes.patch('/events/:idEvent/team/:idMember', verifyToken, validate, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMember = request.params['idMember'];
    const updateRoleTeamMember: { role_to: string } = request.body;

    if (!Number(idEvent) || !Number(idMember))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.updateRoleTeamMember(user, Number(idEvent), Number(idMember), updateRoleTeamMember.role_to)
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} events/:idEvent/team/:idMember 6.4. Delete team member
 * 
 * @apiVersion 1.10.0
 * @apiGroup 6. Team
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMember Team member identification code.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 * 
 * @apiError (400) selfDelete You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit.
 * @apiErrorExample selfDelete
 *  HTTPS/1.1 400 Bad request
 *  { 
 *      "status": 400, 
 *      "message": "You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit" 
 *  }
 *
 * @apiError (404) eventNotFound This event doesn't exists
 * @apiErrorExample eventNotFound
 *  HTTPS/1.1 404 Not found
 *  { 
 *      "status": 404, 
 *      "message": "This event doesn't exists" 
 *  }
 *
 * @apiError (404) teamMemberNotFound This user is not on the organization team for this event.
 * @apiErrorExample teamMemberNotFound
 *  HTTPS/1.1 404 Not found
 *  { 
 *      "status": 404, 
 *      "message": 'This user is not on the organization team for this event' 
 *  }
 *
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 * @apiUse notAllowedError
 * @apiUse notAllowedErrorExample
 */
teamRoutes.delete('/events/:idEvent/team/:idMember', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMember = request.params['idMember'];

    if (!Number(idEvent) || !Number(idMember))
        response.status(400).json({ status: 400, message: "Invalid id." });

    getUserByRequest(request)
        .then(user => {
            controller.deleteTeamMember(user, Number(idEvent), Number(idMember))
                .then((result) => response.status(200).json(result))
                .catch((err) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default teamRoutes;
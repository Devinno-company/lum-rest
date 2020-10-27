import InviteController from "../controller/InviteController";
import express from 'express';
import InviteUserRequest from "../interfaces/request/InviteUserRequest";
import verifyToken from "../middleware/verifyToken";
import getUserByRequest from "../utils/getUserByRequest";
import validate from "../middleware/inputValidation";

const inviteRoutes = express.Router();
const controller = new InviteController();

/**
 * @api {post} events/:idEvent/invite 4.1. Invite a user to the event
 * 
 * @apiVersion 1.9.4
 * @apiGroup 4. Invites
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiParam (Request Body Params) {String} guest_email Guest email.
 * @apiParam (Request Body Params) {String{3}} role User role in project. Possible values: COO (coordinator) and EQP (team member).
 * 
 * @apiExample {json} (Request body:)
 *  {
 *      "guest_email": "joao1980@gmail.com",
 *      "role": "COO"
 *  }
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 * 
 * @apiError (401) noAllowed You don't have permission to do so.
 * 
 * @apiErrorExample noAllowed
 *  HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 * @apiError (404) userNotFound This user does not exists.
 * @apiErrorExample userNotFound
 *  HTTPS/1.1 404 Not found
 *      {
 *          "status": 404,
 *          "message": "This user does not exist"
 *      }
 * 
 * @apiError (409) alreadyInvited This user has already been invited to this project.
 * @apiErrorExample alreadyInvited
 *  HTTPS/1.1 409 Conflict
 *      {
 *          "status": 409,
 *          "message": "This user has already been invited to this project."
 *      }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 */
inviteRoutes.post('/events/:idEvent/invite', verifyToken, validate, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const inviteUser: InviteUserRequest = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.inviteUser(user, Number(idEvent), inviteUser)
                .then(() => response.status(201).json())
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} invites 4.2. Get all your invites
 * 
 * @apiVersion 1.9.4
 * @apiGroup 4. Invites
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiSuccess (200) {Number} id Invite identification code.
 * @apiSuccess (200) {String{..100}} title Invite title.
 * @apiSuccess (200) {String{..255}} content Invite content.
 * @apiSuccess (200) {Object} role User role if you accept the invitation.
 * @apiSuccess (200) {String{..100}} role[name] Role name.
 * @apiSuccess (200) {String{..255}} role[description] Role description.
 * @apiSuccess (200) {Object} status Invite status.
 * @apiSuccess (200) {String{..100}} status[name] Status name.
 * @apiSuccess (200) {String{..255}} status[description] Status description.
 * @apiSuccess (200) {Number} event_id Event Identification code of the event that the user is being invited to.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 OK
 *      [
 *          {
 *              "id": 1,
 *              "title": "Você foi convidado para participar da equipe de organização de um evento",    
 *              "content": "O evento Joao Evento está te convidado para você atuar como membro da equipe do evento.",
 *              "role": {
 *                  "name": "Membro da equipe",
 *                  "description": "Responsável por realizar as tarefas atribuídas a ele."
 *              },
 *              "status": {
 *                  "name": "Pendente",
 *                  "description": "Convite aguarda resposta."
 *              },
 *              "event_id": 1
 *            }
 *      ]
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 */
inviteRoutes.get('/invites', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readInvites(user)
                .then((invites) => response.status(200).json(invites))
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


/**
 * @api {get} invites/:idInvite 4.3. Get a invite
 * 
 * @apiVersion 1.9.4
 * @apiGroup 4. Invites
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idInvite Invite identification code.
 * 
 * @apiSuccess (200) {Number} id Invite identification code.
 * @apiSuccess (200) {String{..100}} title Invite title.
 * @apiSuccess (200) {String{..255}} content Invite content.
 * @apiSuccess (200) {Object} role User role if you accept the invitation.
 * @apiSuccess (200) {String{..100}} role[name] Role name.
 * @apiSuccess (200) {String{..255}} role[description] Role description.
 * @apiSuccess (200) {Object} status Invite status.
 * @apiSuccess (200) {String{..100}} status[name] Status name.
 * @apiSuccess (200) {String{..255}} status[description] Status description.
 * @apiSuccess (200) {Number} event_id Event Identification code of the event that the user is being invited to.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *      {
 *          "id": 1,
 *          "title": "Você foi convidado para participar da equipe de organização de um evento",    
 *          "content": "O evento Joao Evento está te convidado para você atuar como membro da equipe do evento.",
 *          "role": {
 *              "name": "Membro da equipe",
 *              "description": "Responsável por realizar as tarefas atribuídas a ele."
 *          },
 *          "status": {
 *              "name": "Pendente",
 *              "description": "Convite aguarda resposta."
 *          },
 *          "event_id": 1
 *      }
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
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 */
inviteRoutes.get('/invites/:idInvite', verifyToken, (request, response) => {
    const idInvite = request.params['idInvite'];

    if(!Number(idInvite))
        response.status(400).json({status: 400, message: 'Id invalid.'});

    getUserByRequest(request)
        .then(user => {
            controller.readInvite(user, Number(idInvite))
                .then((invite) => response.status(200).json(invite))
                .catch((err) => response.status(err.status | 400). json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {patch} invites/:idInvite 4.4. Reply invitation
 * 
 * @apiVersion 1.9.4
 * @apiGroup 4. Invites
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idInvite Invite identification code.
 * 
 * @apiParam (Request Body Params) {String} choice Invite Response. Possible values: ACE (accept) and REC (Reject).
 * 
 * @apiExample {json} Request body
 *  {
 *      "choice": "ACE"
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
 * @apiError (409) {Object} alreadyAnswered This invite already answered
 * @apiErrorExample alreadyAnswered
 *  HTTPS/1.1 409 alreadyAnswered
 *      {
 *          "status": 409,
 *          "message": "This invitation has already been answered"
 *      }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
inviteRoutes.patch('/invites/:idInvite', verifyToken, validate, (request, response) => {
    const idInvite = request.params['idInvite'];
    const choice = request.body.choice;

    if (!Number(idInvite))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.choiceInvite(user, Number(idInvite), choice)
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} invites/:idInvite 4.5. Delete a invite
 * 
 * @apiVersion 1.9.4
 * @apiGroup 4. Invites
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idInvite Invite identification code.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 * 
 * @apiError (400) {Object} unanswered You can't delete a pending invitation
 * @apiErrorExample unanswered
 *  HTTPS/1.1 400 Bad request
 *      { 
 *          "status": 400, 
 *          "message": "You can't delete a pending invitation" 
 *      }
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
inviteRoutes.delete('/invites/:idInvite', verifyToken, (request, response) => {
    const idInvite = request.params['idInvite'];

    if (!Number(idInvite))
        response.status(400).json({ status: 400, message: 'Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.deleteInvite(user, Number(idInvite))
                .then(result => response.status(200).json(result))
                .catch(err => response.status(err.status | 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default inviteRoutes
import express from 'express';
import TaskController from '../controller/TaskController';
import NewTaskRequest from '../interfaces/request/newTaskRequest';
import UpdateTaskRequest from '../interfaces/request/UpdateTaskRequest';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const taskRoutes = express.Router();
const controller = new TaskController();
/**
 * @api {post} events/:idEvent/tasks 9.1. Create a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} name Task name.
 * @apiParam (Request body params) {String{..255}} description Task description.
 *
 * @apiExample {json} Request body
 *  {
 *      "name": "Lavar o salão",
 *      "description": "É necessário lavar o salão de festa até as 18h do dia 20"
 *  }
 * 
 * @apiSuccess (201) {Number} id Task identification code.
 * @apiSuccess (201) {String} name Task name.
 * @apiSuccess (201) {String} description Task description.
 * @apiSuccess (201) {boolean} completed Task is completed.
 * @apiSuccess (201) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *   {
 *      "id": 4,
 *      "name": "Lavar o salão",
 *      "description": "É necessário lavar o salão de festa até as 18h do dia 20.",
 *      "completed": false,
 *      "user_assigned": null
 *   }
 * 
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.post('/events/:idEvent/tasks', verifyToken, validate, (request, response) => {
    const idEvent = request.params['idEvent'];
    const newTask: NewTaskRequest = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }

    getUserByRequest(request)
        .then((user) => {
            controller.insertTask(user, Number(idEvent), newTask)
                .then((result) => { response.status(201).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {get} events/:idEvent/tasks 9.2. Get all task from the event
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiSuccess (200) {Number} id Task identification code.
 * @apiSuccess (200) {String} name Task name.
 * @apiSuccess (200) {String} description Task description.
 * @apiSuccess (200) {boolean} completed Task is completed.
 * @apiSuccess (200) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  [
 *   {
 *      "id": 4,
 *      "name": "Lavar o salão",
 *      "description": "É necessário lavar o salão de festa até as 18h do dia 20.",
 *      "completed": false,
 *      "user_assigned": null
 *   },
 *   {
 *      "id": 5,
 *      "name": "Fazer a logo",
 *      "description": "Desenvolver o design da logo com uma paleta monocromática.",
 *      "completed": true,
 *      "user_assigned": {
 *          "id": 10,
 *          "name": "Rian",
 *          "surname": "Aquino",
 *          "image": null,
 *          "role": {
 *              "name": "Coordenador",
 *              "description": "Responsável por realizar as tarefas atribuídas a ele."
 *          }
 *      }
 *   },
 *  ]
 * 
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.get('/events/:idEvent/tasks', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }

    getUserByRequest(request)
        .then((user) => {
            controller.readTasks(user, Number(idEvent))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {get} events/:idEvent/tasks/:idTask 9.3. Get a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTask Task identification code.
 * 
 * @apiSuccess (200) {Number} id Task identification code.
 * @apiSuccess (200) {String} name Task name.
 * @apiSuccess (200) {String} description Task description.
 * @apiSuccess (200) {boolean} completed Task is completed.
 * @apiSuccess (200) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      "id": 4,
 *      "name": "Lavar o salão",
 *      "description": "É necessário lavar o salão de festa até as 18h do dia 20.",
 *      "completed": false,
 *      "user_assigned": null
 *   }
 * 
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse taskNotFoundError
 *  @apiUse taskNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.get('/events/:idEvent/tasks/:idTask', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTask = request.params['idTask'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idTask))
        response.status(400).json({ status: 400, message: 'Task id invalid.' });

    getUserByRequest(request)
        .then((user) => {
            controller.readTask(user, Number(idEvent), Number(idTask))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {put} events/:idEvent/tasks/:idTask 9.4. Update a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTask Task identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} [name_to] Task name.
 * @apiParam (Request body params) {String{..255}} [description_to] Task description.
 *
 * @apiExample {json} Request body
 *  {   
 *      "name_to": "Lavar o salão de festas.",
 *      "description_to": "É necessário lavar o salão de festa até as 18h do dia 20. Não pode usar detergente."
 *  }
 * 
 * @apiSuccess (200) {Number} id Task identification code.
 * @apiSuccess (200) {String} name Task name.
 * @apiSuccess (200) {String} description Task description.
 * @apiSuccess (200) {boolean} completed Task is completed.
 * @apiSuccess (200) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *   {
 *      "id": 4,
 *      "name": "Lavar o salão de festas.",
 *      "description": "É necessário lavar o salão de festa até as 18h do dia 20. Não pode usar detergente",
 *      "completed": false,
 *      "user_assigned": null
 *   }
 * 
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse taskNotFoundError
 *  @apiUse taskNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.put('/events/:idEvent/tasks/:idTask', verifyToken, validate, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTask = request.params['idTask'];
    const updateTask: UpdateTaskRequest = request.body;

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idTask))
        response.status(400).json({ status: 400, message: 'Task id invalid.' });

    getUserByRequest(request)
        .then((user) => {
            controller.updateTask(user, Number(idEvent), Number(idTask), updateTask)
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {delete} events/:idEvent/tasks/:idTask 9.5. Delete a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTask Task identification code.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 * 
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse taskNotFoundError
 *  @apiUse taskNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.delete('/events/:idEvent/tasks/:idTask', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTask = request.params['idTask'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idTask))
        response.status(400).json({ status: 400, message: 'Task id invalid.' });

    getUserByRequest(request)
        .then((user) => {
            controller.deleteTask(user, Number(idEvent), Number(idTask))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {patch} events/:idEvent/tasks/:idTask 9.6. Complete and Uncomplete a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTask Task identification code.
 * 
 * @apiSuccess (200) {Number} id Task identification code.
 * @apiSuccess (200) {String} name Task name.
 * @apiSuccess (200) {String} description Task description.
 * @apiSuccess (200) {boolean} completed Task is completed.
 * @apiSuccess (200) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 201 Created
 *   {
 *      "id": 4,
 *      "name": "Lavar o salão",
 *      "description": "É necessário lavar o salão de festa até as 18h do dia 20. Não pode usar detergente",
 *      "completed": true,
 *      "user_assigned": null
 *   }
 * 
 * @apiError (401) {Object} unassign You must assign the task to complete it.
 * @apiErrorExample unassign
 *  HTTPS/1.1 401 Unauthorized
 *      { 
 *          "status": 401, 
 *          "message": "To complete or uncomplete a task you need to assign it"
 *      }  
 * 
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse taskNotFoundError
 *  @apiUse taskNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.patch('/events/:idEvent/tasks/:idTask', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTask = request.params['idTask'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idTask))
        response.status(400).json({ status: 400, message: 'Task id invalid.' });

    getUserByRequest(request)
        .then((user) => {
            controller.completeAndUncompleteTask(user, Number(idEvent), Number(idTask))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {patch} events/:idEvent/tasks/:idTask/assign 9.7. Assign a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTask Task identification code.
 * 
 * @apiSuccess (200) {Number} id Task identification code.
 * @apiSuccess (200) {String} name Task name.
 * @apiSuccess (200) {String} description Task description.
 * @apiSuccess (200) {boolean} completed Task is completed.
 * @apiSuccess (200) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *   {
 *      "id": 5,
 *      "name": "Fazer a logo",
 *      "description": "Desenvolver o design da logo com uma paleta monocromática.",
 *      "completed": true,
 *      "user_assigned": {
 *          "id": 10,
 *          "name": "Rian",
 *          "surname": "Aquino",
 *          "image": null,
 *          "role": {
 *              "name": "Coordenador",
 *              "description": "Responsável por realizar as tarefas atribuídas a ele."
 *          }
 *      }
 *   }
 * 
 *  @apiError (401) {Object} alreadyAssigned This task already assigned
 *  @apiErrorExample alreadyAssigned
 *     HTTPS/1.1 401 Unauthorized
 *      { 
 *          "status": 401, 
 *          "message": "This task already assigned" 
 *      }
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse taskNotFoundError
 *  @apiUse taskNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.patch('/events/:idEvent/tasks/:idTask/assign', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTask = request.params['idTask'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idTask))
        response.status(400).json({ status: 400, message: 'Task id invalid.' });

    getUserByRequest(request)
        .then((user) => {
            controller.assignTask(user, Number(idEvent), Number(idTask))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

/**
 * @api {patch} events/:idEvent/tasks/:idTask/assign 9.8. Unassign a task
 * 
 * @apiVersion 1.16.0
 * @apiGroup 9. Tasks
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idTask Task identification code.
 * 
 * @apiSuccess (200) {Number} id Task identification code.
 * @apiSuccess (200) {String} name Task name.
 * @apiSuccess (200) {String} description Task description.
 * @apiSuccess (200) {boolean} completed Task is completed.
 * @apiSuccess (200) {Object} [user_assigned] Task user assigned.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 Ok
 *   {
 *      "id": 5,
 *      "name": "Fazer a logo",
 *      "description": "Desenvolver o design da logo com uma paleta monocromática.",
 *      "completed": true,
 *      "user_assigned": null
 *   } 
 * 
 *  
 *  @apiErrorExample assignedAnother
 *   HTTPS/1.1 401 Unauthorized
 *    { 
 *      "status": 401, 
 *      "message": "You cannot unassign a task that you did not assign"
 *    }
 * 
 *  @apiErrorExample notAssigned
 *   HTTPS/1.1 401 Unauthorized
 *    { 
 *      "status": 401, 
 *      "message": "This task has not been assigned "
 *    }
 * 
 *  @apiErrorExample alreadyComplete
 *   HTTPS/1.1 409 Conflict
 *    { 
 *      "status": 409, 
 *      "message": "You can't unassign a task that's already completed"
 *    }
 *  @apiUse eventNotFoundError
 *  @apiUse eventNotFoundErrorExample
 *  @apiUse taskNotFoundError
 *  @apiUse taskNotFoundErrorExample
 *  @apiUse notAllowedError
 *  @apiUse notAllowedErrorExample
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
taskRoutes.patch('/events/:idEvent/tasks/:idTask/unassign', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTask = request.params['idTask'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });

    if (!Number(idTask))
        response.status(400).json({ status: 400, message: 'Task id invalid.' });

    getUserByRequest(request)
        .then((user) => {
            controller.unassignTask(user, Number(idEvent), Number(idTask))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) })
        })
        .catch((err) => response.status(400 || err).json(err))
});

export default taskRoutes;
import express from 'express';
import TaskController from '../controller/TaskController';
import NewTaskRequest from '../interfaces/request/newTaskRequest';
import UpdateTaskRequest from '../interfaces/request/UpdateTaskRequest';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const taskRoutes = express.Router();
const controller = new TaskController();

taskRoutes.post('/events/:idEvent/tasks', verifyToken, (request, response) => {
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

taskRoutes.put('/events/:idEvent/tasks/:idTask', verifyToken, (request, response) => {
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

export default taskRoutes;
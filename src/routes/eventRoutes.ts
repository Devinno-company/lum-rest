import express from 'express';
import EventController from '../controller/EventController';
import NewEvent from '../interfaces/request/NewEvent';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const eventRoutes = express.Router();
const controller = new EventController();

eventRoutes.post('/events', verifyToken, validate, async (request, response) => {
    const user = await getUserByRequest(request);
    const newEvent: NewEvent = request.body;
    
    controller.insertEvent(newEvent, user)
        .then(result => response.status(201).json(result))
        .catch(err => response.status(err.status | 400).json(err));
});

eventRoutes.get('/events/:idEvent', verifyToken, async (request, response) => {
    const user = await getUserByRequest(request);
    const idEvent = request.params['idEvent'];
    
    if(!Number(idEvent)) {
        response.status(400).json({message: 'Id invalid.'});
    }
    
    controller.readEvent(Number(idEvent), user)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(err.status | 400).json(err));
})

export default eventRoutes;
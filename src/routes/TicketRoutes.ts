import express from 'express';
import TicketController from '../controller/TicketController';
import NewTicketRequest from '../interfaces/request/NewTicketRequest';
import UpdateTicketRequest from '../interfaces/request/UpdateTicketRequest';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const ticketRoutes = express.Router();
const controller = new TicketController();

ticketRoutes.post('/events/:idEvent/tickets', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const newTicket: NewTicketRequest = request.body;

    if (!Number(idEvent) || idEvent == "null")
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.insertTicket(user, Number(idEvent), newTicket)
                .then((result) => { response.status(201).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) });
        })
        .catch((err) => { response.status(err.status || 400).json(err) });
});

ticketRoutes.get('/events/:idEvent/tickets', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent) || idEvent == "null")
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.readTickets(user, Number(idEvent))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) });
        })
        .catch((err) => { response.status(err.status || 400).json(err) });
});

ticketRoutes.get('/events/:idEvent/tickets/:idTicket', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTicket = request.params['idTicket'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });
    if (!Number(idTicket))
        response.status(400).json({ status: 400, message: 'Ticket id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.readTicket(user, Number(idEvent), Number(idTicket))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) });
        })
        .catch((err) => { response.status(err.status || 400).json(err) });
});

ticketRoutes.put('/events/:idEvent/tickets/:idTicket', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTicket = request.params['idTicket'];
    const updateTicket: UpdateTicketRequest = request.body

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });
    if (!Number(idTicket))
        response.status(400).json({ status: 400, message: 'Ticket id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.updateTicket(user, Number(idEvent), Number(idTicket), updateTicket)
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) });
        })
        .catch((err) => { response.status(err.status || 400).json(err) });
});

ticketRoutes.delete('/events/:idEvent/tickets/:idTicket', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idTicket = request.params['idTicket'];

    if (!Number(idEvent))
        response.status(400).json({ status: 400, message: 'Event id invalid.' });
    if (!Number(idTicket))
        response.status(400).json({ status: 400, message: 'Ticket id invalid.' });

    getUserByRequest(request)
        .then(user => {
            controller.deleteTicket(user, Number(idEvent), Number(idTicket))
                .then((result) => { response.status(200).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) });
        })
        .catch((err) => { response.status(err.status || 400).json(err) });
});

export default ticketRoutes;
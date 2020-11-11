import express from 'express';
import PurchaseController from '../controller/PurchaseController';
import NewPurchase from '../interfaces/request/NewPurchase';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const purchaseRoutes = express.Router();
const controller = new PurchaseController();

/**
 * @api {post} purchases 13.1. Create purchase
 * 
 * @apiVersion 1.27.1
 * @apiGroup 13. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 *     //// COLOCAR EXEMPLO DE INPUT
 * 
 * @apiSuccess (200) {Number} cd_purchase Purchase identification code.
 * @apiSuccess (200) {String} sg_status Purchase status.
 * @apiSuccess (200) {Object[ticket]} tickets Tickets in the purchase.
 * @apiSuccess (200) {Number} tickets[idTicket] Ticket identification code.
 * @apiSuccess (200) {String} tickets[TicketName] Ticket name.
 * @apiSuccess (200) {String} tickets[TicketEvent] Event name.
 * @apiSuccess (200) {Number} tickets[TicketQuantity] Ticket Quantity.
 * @apiSuccess (200) {Number} tickets[TicketValue] Ticket Value.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      "cd_purchase": 1,
 *      "sg_status": "PEN",
 *      "tickets": [
 *          {
 *              "idTicket": 1,
 *              "TicketName": "Ticket Normal F&F",
 *              "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 2,
 *              "TicketValue": 50.75
 *          }
 *          {
 *              "idTicket": 2,
 *              "TicketName": "Ticket Vip F&F",
 *              "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 1,
 *              "TicketValue": 120.50
 *          }
 *      ]
 *   }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
purchaseRoutes.post('/purchases', verifyToken, (request, response) => {
    const newPurchase: NewPurchase = request.body;

    getUserByRequest(request)
        .then(user => {
            controller.insertPurchase(user, newPurchase)
                .then((result) => { response.status(201).json(result) })
                .catch((err) => { response.status(err.status || 400).json(err) });
        })
        .catch((err) => { response.status(err.status || 400).json(err) });

});

/**
 * @api {get} purchases/:idPurchase 13.2. Get purchase by id
 * 
 * @apiVersion 1.27.1
 * @apiGroup 13. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idPurchase Purchase identification code.
 * 
 * @apiSuccess (200) {Number} cd_purchase Purchase identification code.
 * @apiSuccess (200) {String} sg_status Purchase status.
 * @apiSuccess (200) {Object[ticket]} tickets Tickets in the purchase.
 * @apiSuccess (200) {Number} tickets[idTicket] Ticket identification code.
 * @apiSuccess (200) {String} tickets[TicketName] Ticket name.
 * @apiSuccess (200) {String} tickets[TicketEvent] Event name.
 * @apiSuccess (200) {Number} tickets[TicketQuantity] Ticket Quantity.
 * @apiSuccess (200) {Number} tickets[TicketValue] Ticket Value.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      "cd_purchase": 1,
 *      "sg_status": "PEN",
 *      "tickets": [
 *          {
 *              "idTicket": 1,
 *              "TicketName": "Ticket Normal F&F",
 *              "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 2,
 *              "TicketValue": 50.75
 *          }
 *          {
 *              "idTicket": 2,
 *              "TicketName": "Ticket Vip F&F",
 *              "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 1,
 *              "TicketValue": 120.50
 *          }
 *      ]
 *   }
 * 
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
purchaseRoutes.get('/purchases/:idPurchase', verifyToken, async (request, response) => {
    const idPurchase = request.params['idPurchase'];

    if (!Number(idPurchase)) {
        response.status(400).json({ message: 'Purchase Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.readPurchase(user, Number(idPurchase))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} purchases/ 13.3. Get all purchases from user
 * 
 * @apiVersion 1.27.1
 * @apiGroup 13. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiSuccess (200) {Number} cd_purchase Purchase identification code.
 * @apiSuccess (200) {String} sg_status Purchase status.
 * @apiSuccess (200) {Object[ticket]} tickets Tickets in the purchase.
 * @apiSuccess (200) {Number} tickets[idTicket] Ticket identification code.
 * @apiSuccess (200) {String} tickets[TicketName] Ticket name.
 * @apiSuccess (200) {String} tickets[TicketEvent] Event name.
 * @apiSuccess (200) {Number} tickets[TicketQuantity] Ticket Quantity.
 * @apiSuccess (200) {Number} tickets[TicketValue] Ticket Value.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      "cd_purchase": 1,
 *      "sg_status": "PEN",
 *      "tickets": [
 *          {
 *              "idTicket": 1,
 *              "TicketName": "Ticket Normal F&F",
 *              "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 2,
 *              "TicketValue": 50.75
 *          }
 *          {
 *              "idTicket": 2,
 *              "TicketName": "Ticket Vip F&F",
 *              "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 1,
 *              "TicketValue": 120.50
 *          }
 *      ]
 *   }
 *   {
 *      "cd_purchase": 2,
 *      "sg_status": "PEN",
 *      "tickets": [
 *          {
 *              "idTicket": 1,
 *              "TicketName": "Ticket Normal F&F",
 *             "TicketEvent": "Flores e Frutas",
 *              "TicketQuantity": 5,
 *              "TicketValue": 50.75
 *          }
 *      ]
 *   }
 *
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
purchaseRoutes.get('/purchases', verifyToken, async (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readPurchases(user)
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default purchaseRoutes;
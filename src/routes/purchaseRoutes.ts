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
 * @apiVersion 1.29.5
 * @apiGroup 13. Purchases
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Request body params) {Number} [ticket_id] Ticket id.
 * @apiParam (Request body params) {Number} [quantity_ticket] Ticket quantity.
 * @apiParam (Request body params) {String{11}} [cpf_payer] CPF from the payer.
 * @apiParam (Request body params) {String{3..100}} [type_payment] Type of Payment
 * @apiParam (Request body params) {Object} billet Billet information.
 * @apiParam (Request body params) {String{8}} billet[zip_code] Billet Zip Code.
 * @apiParam (Request body params) {String{3..255}} billet[street_name] Billet Street Name.
 * @apiParam (Request body params) {String{3..10}} billet[street_number] Billet Street Number.
 * @apiParam (Request body params) {String{3..100}} billet[neighborhood] Billet Neighborhood.
 * @apiParam (Request body params) {String{3..100}} billet[city] Billet City.
 * @apiParam (Request body params) {String{2}} billet[federal_unit] Billet Federal Unit.
 * @apiParam (Request body params) {Object} credit_card Credit Card information.
 * @apiParam (Request body params) {String{3..100}} credit_card[payment_method_id] Credit Card ID Payment Method.
 * @apiParam (Request body params) {String{3..255}} credit_card[token] Credit Card Token.
 * @apiParam (Request body params) {Number} credit_card[installments] Credit Card Installments.
 * @apiParam (Request body params) {String(3..100)} credit_card[issuer] Credit Card Issuer.
 * 
 * @apiExample {json} Request body:
 * {
 *   "ticket_id": 1,
 *   "quantity_ticket": 1,
 *   "cpf_payer": "25654817051",
 *   "type_payment": "billet",
 *   "billet": {
 *       "zip_code": "71015070",
 *       "street_name": "Quadra QI 14 Bloco G",
 *       "street_number": "443",
 *       "neighborhood": "Guará I",
 *       "city": "Brasília",
 *       "federal_unit": "DF"
 *   }
 * }
 * @apiExample {json} Request body:
 * {
 *   "ticket_id": 3,
 *   "quantity_ticket": 4,
 *   "cpf_payer": "46423980071",
 *   "type_payment": "credit-card",
 *   "credit_card": {
 *       "payment_method_id": "",
 *       "token": "",
 *       "installments": 2,
 *       "issuer": ""
 *   }
 * }
 * 
 * @apiSuccess (200) {Number} [id] Purchase id.
 * @apiSuccess (200) {Number} [idMercadoPago] Mercado Pago id.
 * @apiSuccess (200) {Date} [PurchaseDate] Purchase Date.
 * @apiSuccess (200) {String} [PurchaseStatus] Purchase Status.
 * @apiSuccess (200) {Object} ticket Ticket information.
 * @apiSuccess (200) {Number} ticket[idTicket] Ticket Id Code.
 * @apiSuccess (200) {String} ticket[TicketName] Ticket Name.
 * @apiSuccess (200) {String} ticket[TicketEvent] Ticket Event.
 * @apiSuccess (200) {Number} ticket[TicketQuantity] Ticket Quantity.
 * @apiSuccess (200) {Number} ticket[TicketValue] Ticket Value.
 * @apiSuccess (200) {Object} billet Billet information.
 * @apiSuccess (200) {Number} billet[idBillet] Billet Id.
 * @apiSuccess (200) {String} billet[BilletImage] Billet Image.
 * @apiSuccess (200) {Date} billet[BilletPurchaseDate] Billet Purchase Date.
 * @apiSuccess (200) {Object} credit_card Credit Card information.
 * @apiSuccess (200) {Number} credit_card[idCreditCard] Credit Card Id Code.
 * @apiSuccess (200) {String} credit_card[CreditCardPaymentMethod] Credit Card Payment Method.
 * @apiSuccess (200) {Date} credit_card[CreditCardApprovedDate] Credit Card Approved Date.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      id: 1,
 *      idMercadoPago: 324,
 *      PurchaseDate: "2020-12-11",
 *      PurchaseStatus: "PEN",
 *      ticket: {
 *          idTicket: 1,
 *          TicketName: "Entrada VIP",
 *          TicketEvent: "Flores e Frutas",
 *          TicketQuantity: 2,
 *          TicketValue: 53.50
 *      }
 *      billet: {
 *          idBillet: 1,
 *          BilletImage: "",
 *          BilletPurchaseDate: "2020-12-12"
 *      }
 *  }
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      id: 2,
 *      idMercadoPago: 523,
 *      PurchaseDate: "2020-11-22",
 *      PurchaseStatus: "CON",
 *      ticket: {
 *          idTicket: 2,
 *          TicketName: "Entrada Comum",
 *          TicketEvent: "Flores e Frutas",
 *          TicketQuantity: 1,
 *          TicketValue: 22.00
 *      }
 *      credit_card: {
 *          idCreditCard: 1,
 *          CreditCardPaymentMethod: "",
 *          CreditCardApprovedDate: "2020-11-23"
 *      }
 *  }
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
 * @apiVersion 1.29.5
 * @apiGroup 13. Purchases
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idPurchase Purchase identification code.
 * 
 * @apiSuccess (200) {Number} [id] Purchase id.
 * @apiSuccess (200) {Number} [idMercadoPago] Mercado Pago id.
 * @apiSuccess (200) {Date} [PurchaseDate] Purchase Date.
 * @apiSuccess (200) {String} [PurchaseStatus] Purchase Status.
 * @apiSuccess (200) {Object} ticket Ticket information.
 * @apiSuccess (200) {Number} ticket[idTicket] Ticket Id Code.
 * @apiSuccess (200) {String} ticket[TicketName] Ticket Name.
 * @apiSuccess (200) {String} ticket[TicketEvent] Ticket Event.
 * @apiSuccess (200) {Number} ticket[TicketQuantity] Ticket Quantity.
 * @apiSuccess (200) {Number} ticket[TicketValue] Ticket Value.
 * @apiSuccess (200) {Object} billet Billet information.
 * @apiSuccess (200) {Number} billet[idBillet] Billet Id.
 * @apiSuccess (200) {String} billet[BilletImage] Billet Image.
 * @apiSuccess (200) {Date} billet[BilletPurchaseDate] Billet Purchase Date.
 * @apiSuccess (200) {Object} credit_card Credit Card information.
 * @apiSuccess (200) {Number} credit_card[idCreditCard] Credit Card Id Code.
 * @apiSuccess (200) {String} credit_card[CreditCardPaymentMethod] Credit Card Payment Method.
 * @apiSuccess (200) {Date} credit_card[CreditCardApprovedDate] Credit Card Approved Date.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      id: 2,
 *      idMercadoPago: 523,
 *      PurchaseDate: "2020-11-22",
 *      PurchaseStatus: "CON",
 *      ticket: {
 *          idTicket: 2,
 *          TicketName: "Entrada Comum",
 *          TicketEvent: "Flores e Frutas",
 *          TicketQuantity: 1,
 *          TicketValue: 22.00
 *      }
 *      credit_card: {
 *          idCreditCard: 1,
 *          CreditCardPaymentMethod: "",
 *          CreditCardApprovedDate: "2020-11-23"
 *      }
 *  }
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
 * @apiVersion 1.29.5
 * @apiGroup 13. Purchases
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiSuccess (200) {Number} [id] Purchase id.
 * @apiSuccess (200) {Number} [idMercadoPago] Mercado Pago id.
 * @apiSuccess (200) {Date} [PurchaseDate] Purchase Date.
 * @apiSuccess (200) {String} [PurchaseStatus] Purchase Status.
 * @apiSuccess (200) {Object} ticket Ticket information.
 * @apiSuccess (200) {Number} ticket[idTicket] Ticket Id Code.
 * @apiSuccess (200) {String} ticket[TicketName] Ticket Name.
 * @apiSuccess (200) {String} ticket[TicketEvent] Ticket Event.
 * @apiSuccess (200) {Number} ticket[TicketQuantity] Ticket Quantity.
 * @apiSuccess (200) {Number} ticket[TicketValue] Ticket Value.
 * @apiSuccess (200) {Object} billet Billet information.
 * @apiSuccess (200) {Number} billet[idBillet] Billet Id.
 * @apiSuccess (200) {String} billet[BilletImage] Billet Image.
 * @apiSuccess (200) {Date} billet[BilletPurchaseDate] Billet Purchase Date.
 * @apiSuccess (200) {Object} credit_card Credit Card information.
 * @apiSuccess (200) {Number} credit_card[idCreditCard] Credit Card Id Code.
 * @apiSuccess (200) {String} credit_card[CreditCardPaymentMethod] Credit Card Payment Method.
 * @apiSuccess (200) {Date} credit_card[CreditCardApprovedDate] Credit Card Approved Date.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      id: 1,
 *      idMercadoPago: 324,
 *      PurchaseDate: "2020-12-11",
 *      PurchaseStatus: "PEN",
 *      ticket: {
 *          idTicket: 1,
 *          TicketName: "Entrada VIP",
 *          TicketEvent: "Flores e Frutas",
 *          TicketQuantity: 2,
 *          TicketValue: 53.50
 *      }
 *      billet: {
 *          idBillet: 1,
 *          BilletImage: "",
 *          BilletPurchaseDate: "2020-12-12"
 *      }
 *   }
 *   {
 *      id: 2,
 *      idMercadoPago: 523,
 *      PurchaseDate: "2020-11-22",
 *      PurchaseStatus: "CON",
 *      ticket: {
 *          idTicket: 2,
 *          TicketName: "Entrada Comum",
 *          TicketEvent: "Flores e Frutas",
 *          TicketQuantity: 1,
 *          TicketValue: 22.00
 *      }
 *      credit_card: {
 *          idCreditCard: 1,
 *          CreditCardPaymentMethod: "",
 *          CreditCardApprovedDate: "2020-11-23"
 *      }
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

purchaseRoutes.put('/purchases/:idPurchase/cancel', verifyToken, async (request, response) => {
    const idPurchase = request.params['idPurchase'];

    getUserByRequest(request)
        .then(user => {
            controller.cancelPurchase(user, Number(idPurchase))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

purchaseRoutes.get('/purchases/:idPurchase/download', (request, response) => {
    const idPurchase = request.params['idPurchase'];

    if (!Number(idPurchase)) {
        response.status(400).json({ message: 'Purchase Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.downloadPurchase(user, Number(idPurchase))
                .then((result) => response.status(200).contentType('application/pdf').sendFile(result.filename))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default purchaseRoutes;
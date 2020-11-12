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
 * @apiParam
 * 
 * @apiSuccess 
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      
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
 * @apiSuccess
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      
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
 * @apiSuccess 
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      
 *   }
 *   {
 *      
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
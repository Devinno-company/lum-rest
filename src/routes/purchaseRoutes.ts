import express from 'express';
import PurchaseController from '../controller/PurchaseController';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const purchaseRoutes = express.Router();
const controller = new PurchaseController();


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
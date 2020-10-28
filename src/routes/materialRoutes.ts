import express from 'express';
import MaterialController from '../controller/MaterialController';
import InsertMaterial from '../interfaces/inputRepository/insertMaterial';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';
import UpdateMaterialRequest from '../interfaces/request/UpdateMaterialRequest';
import MaterialResponse from '../interfaces/response/MaterialResponse';

const materialRoutes = express.Router();
const controller = new MaterialController();


materialRoutes.post('/events/:idEvent/material', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const insertMaterial: InsertMaterial = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.insertMaterial(user, Number(idEvent), insertMaterial)
                .then((result) => response.status(201).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


materialRoutes.get('/events/:idEvent/material/:idMaterial', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMaterial = request.params['idMaterial'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idMaterial)) {
        response.status(400).json({ message: 'Material Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.readMaterial(user, Number(idEvent), Number(idMaterial))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


materialRoutes.get('/events/:idEvent/material', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.readMaterials(user, Number(idEvent))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


materialRoutes.put('/events/:idEvent/material/:idMaterial', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMaterial = request.params['idMaterial'];
    const updateMaterial: UpdateMaterialRequest = request.body;

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idMaterial)) {
        response.status(400).json({ message: 'Material Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.updateMaterial(user, updateMaterial, Number(idEvent), Number(idMaterial))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


materialRoutes.delete('/events/:idEvent/material/:idMaterial', verifyToken, async (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMaterial = request.params['idMaterial'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idMaterial)) {
        response.status(400).json({ message: 'Material Id invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.deleteMaterial(user, Number(idEvent), Number(idMaterial))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default materialRoutes;
import express from 'express';
import MaterialController from '../controller/MaterialController';
import InsertMaterial from '../interfaces/inputRepository/insertMaterial';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';
import UpdateMaterialRequest from '../interfaces/request/UpdateMaterialRequest';

const materialRoutes = express.Router();
const controller = new MaterialController();

/**
 * @api {post} events/:idEvent/materials 7.1. Create material
 * 
 * @apiVersion 1.12.5
 * @apiGroup 7. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} [nm_material] Material name.
 * @apiParam (Request body params) {Number} [qt_material] Material quantity.
 * @apiParam (Request body params) {String{..255}} [ds_observation] Material observation.
 * 
 * @apiExample {json} Request body:
 *  {
 *      "nm_material": "Cadeiras Amarelas",
 *      "qt_material": "6",
 *      "ds_observation": "Cadeiras de madeira com estofado, de cor amarela"
 *  }
 * 
 * @apiSuccess (200) {Number} id Material identification code.
 * @apiSuccess (200) {String} name Material name.
 * @apiSuccess (200) {Number} quantity Material quantity.
 * @apiSuccess (200) {String} observation Material observation name.
 * @apiSuccess (200) {String} status Material status.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 201 Created
 *   {
 *      "id": "4",
 *      "name": "Cadeiras Amarelas",
 *      "quantity": "6",
 *      "observation": "Cadeiras de madeira com estofado, de cor amarela",
 *      "status": "PEN"
 *   }
 *  
 * @apiError (401) {Object} noAllowed You don't have permission to do so.
 * @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
materialRoutes.post('/events/:idEvent/materials', verifyToken, async (request, response) => {
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

/**
 * @api {get} events/:idEvent/materials/:idMaterial 7.2. Get material by id
 * 
 * @apiVersion 1.12.5
 * @apiGroup 6. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMaterial Material identification code.
 * 
 * @apiSuccess (200) {Number} id Material identification code.
 * @apiSuccess (200) {String} name Material name.
 * @apiSuccess (200) {Number} quantity Material quantity.
 * @apiSuccess (200) {String} observation Material observation name.
 * @apiSuccess (200) {String} status Material status.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *   {
 *      "id": "4",
 *      "name": "Cadeiras Amarelas",
 *      "quantity": "6",
 *      "observation": "Cadeiras de madeira com estofado, de cor amarela",
 *      "status": "PEN"
 *   }
 * 
 *  @apiError (401) {Object} noAllowed You don't have permission to do so.
 *  @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
materialRoutes.get('/events/:idEvent/materials/:idMaterial', verifyToken, async (request, response) => {
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

/**
 * @api {get} events/:idEvent/materials 7.3. Get all materials from event
 * 
 * @apiVersion 1.12.5
 * @apiGroup 7. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * 
 * @apiSuccess (200) {Number} id Material identification code.
 * @apiSuccess (200) {String} name Material name.
 * @apiSuccess (200) {Number} quantity Material quantity.
 * @apiSuccess (200) {String} observation Material observation name.
 * @apiSuccess (200) {String} status Material status.
 * 
 * @apiSuccessExample Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      "id": "2",
 *      "name": "Mesas de Bar",
 *      "quantity": "5",
 *      "observation": "Mesas de bar de plastico tamanho médio",
 *      "status": "PEN"
 *   }
 *   {
 *      "id": "4",
 *      "name": "Cadeiras Amarelas",
 *      "quantity": "6",
 *      "observation": "Cadeiras de madeira com estofado, de cor amarela",
 *      "status": "PEN"
 *   }
 * 
 *  @apiError (401) {Object} noAllowed You don't have permission to do so.
 *  @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 * 
 *  @apiUse noTokenError
 *  @apiUse noTokenErrorExample
 *  @apiUse invalidTokenError
 *  @apiUse invalidTokenErrorExample
 *  @apiUse incorrectFieldsError
 */
materialRoutes.get('/events/:idEvent/materials', verifyToken, async (request, response) => {
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

/**
 * @api {put} events/:idEvent/materials/:idMaterial 7.4. Update material
 * 
 * @apiVersion 1.12.5
 * @apiGroup 7. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMaterial Material identification code.
 * 
 * @apiParam (Request body params) {String{3..100}} [name_to] New material name.
 * @apiParam (Request body params) {Number} [quantity_to] New material quantity.
 * @apiParam (Request body params) {String{..255}} [description_to] New material observation.
 * 
 * @apiExample {json} Request body:
 *  {
 *      "name_to": "Cadeiras Verdes",
 *      "quantity_to": "10",
 *      "description_to": "Cadeiras de plastico sem estofado de cor verde"
 *  }
 * 
 * @apiSuccess (200) {Number} id Material identification code.
 * @apiSuccess (200) {String} name Material name.
 * @apiSuccess (200) {Number} quantity Material quantity.
 * @apiSuccess (200) {String} observation Material observation name.
 * @apiSuccess (200) {String} status Material status.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 200 OK
 *   {
 *      "id": "4",
 *      "name": "Cadeiras Verdes",
 *      "quantity": "10",
 *      "observation": "Cadeiras de plastico sem estofado, de cor verde",
 *      "status": "PEN"
 *   }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 * @apiError (400) noField No field need be updated.
 * @apiErrorExample noField:
 *  HTTPS/1.1 400 Bad Request
 *      { 
 *          status: 400, 
 *          message: 'No field to update' 
 *      }
 * 
 * @apiError (401) {Object} noAllowed You don't have permission to do so.
 * @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 */
materialRoutes.put('/events/:idEvent/materials/:idMaterial', verifyToken, (request, response) => {
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

/**
 * @api {put} events/:idEvent/materials/:idMaterial/acquired 7.5. Update material already acquired.
 * 
 * @apiVersion 1.15.0
 * @apiGroup 7. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMaterial Material identification code.
 * 
 * @apiParam (Request body params) {Number} [acquired] Material quantity already acquired.
 * 
 * @apiExample {json} Request body:
 *  {
 *      "acquired": 24
 *  }
 * 
 * @apiSuccess (200) {Number} id Material identification code.
 * @apiSuccess (200) {String} name Material name.
 * @apiSuccess (200) {Number} quantity Material quantity.
 * @apiSuccess (200) {String} observation Material observation name.
 * @apiSuccess (200) {String} status Material status.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 200 OK
 *   {
 *      "id": "4",
 *      "name": "Cadeiras Verdes",
 *      "quantity": "10",
 *      "acquired": "24",
 *      "observation": "Cadeiras de plastico sem estofado, de cor verde",
 *      "status": "ADQ"
 *   }
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 * @apiError (400) noField No field need be updated.
 * @apiErrorExample noField:
 *  HTTPS/1.1 400 Bad Request
 *      { 
 *          status: 400, 
 *          message: 'No field to update' 
 *      }
 * 
 * @apiError (401) {Object} noAllowed You don't have permission to do so.
 * @apiErrorExample noAllowed
 *   HTTPS/1.1 401 Unauthorized
 *      {
 *          "status": 401,
 *          "message": "You are not allowed do so"
 *      }
 */
materialRoutes.put('/events/:idEvent/materials/:idMaterial/acquired', verifyToken, (request, response) => {
    const idEvent = request.params['idEvent'];
    const idMaterial = request.params['idMaterial'];
    const acquired = request.body['acquired'];

    if (!Number(idEvent)) {
        response.status(400).json({ status: 400, message: 'Event Id invalid.' });
    }
    if (!Number(idMaterial)) {
        response.status(400).json({ message: 'Material Id invalid.' });
    }
    if (!Number(acquired)) {
        response.status(400).json({ message: 'Acquired number invalid.' });
    }

    getUserByRequest(request)
        .then(user => {
            controller.updateAcquired(user, acquired, Number(idEvent), Number(idMaterial))
                .then((result) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} events/:idEvent/materials/:idMaterial 7.6. Delete a Material
 * 
 * @apiVersion 1.12.5
 * @apiGroup 7. Materials
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Path Params) {Number} idEvent Event identification code.
 * @apiParam (Path Params) {Number} idMaterial Material identification code.
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
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidIdError
 * @apiUse invalidIdErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 */
materialRoutes.delete('/events/:idEvent/materials/:idMaterial', verifyToken, async (request, response) => {
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
import express from 'express';
import getUserByRequest from "../utils/getUserByRequest";
import multer from "multer";
import ProfileController from '../controller/ProfileController';
import updatePassword from '../interfaces/request/UpdatePasswordRequest';
import UpdateUserRequest from '../interfaces/request/UpdateUserRequest';
import UserResponse from '../interfaces/response/UserResponse';
import validateImage from '../middleware/imageValidation';
import validate from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';
import CredentialsRequest from '../interfaces/request/CredentialsRequest';

const profileRoutes = express.Router();
const controller = new ProfileController();
const formData = multer();

/**
 * @apiDefine notAllowedError
 * @apiError (401) {Object} notAllowed You are not allowed to do so
 */

/**
* @apiDefine notAllowedErrorExample
* @apiErrorExample notAllowed
*   HTTPS/1.1 401 Unauthorized
*   { 
*       "status": 401, 
*       "message": "You are not allowed to do so" 
*   }
*/

/**
 * @apiDefine noTokenError
 * @apiError (400) {Object} noneToken None token inserted in header x-access-token
 */

/**
 * @apiDefine noTokenErrorExample
 * @apiErrorExample {json} No token error
 *  HTTPS/1.1 403 Forbidden
 *  {
 *      "status": 403,
 *      "message": "none token provided"
 *  }
 */

/**
* @apiDefine taskNotFoundError
* @apiError (404) {Object} taskNotFound This task doesn't exists
*/

/**
* @apiDefine taskNotFoundErrorExample
* @apiErrorExample taskNotFound
*   HTTPS/1.1 404 Not found
*   { 
*        "status": 404, 
*        "message": "This task doesn't exists" 
*    }
*/

/**
* @apiDefine eventNotFoundError
* @apiError (404) {Object} eventNotFound This events doesn't exists
*/

/**
* @apiDefine eventNotFoundErrorExample
* @apiErrorExample eventNotFound
*   HTTPS/1.1 404 Not found
*   { 
*        "status": 404, 
*        "message": "This event doesn't exists" 
*    }
*/

/**
 * @apiDefine noTokenError
 * @apiError (400) {Object} noneToken None token inserted in header x-access-token
 */

/**
 * @apiDefine noTokenErrorExample
 * @apiErrorExample {json} No token error
 *  HTTPS/1.1 403 Forbidden
 *  {
 *      "status": 403,
 *      "message": "none token provided"
 *  }
 */

/** 
 * @apiDefine invalidIdError
 * @apiError (400) {Object} invalidId the id provided this in an incorrect format.
 */

/**
 * @apiDefine invalidIdErrorExample
 * @apiErrorExample invalidId 
 *  HTTPS/1.1 400 Bad request
 *      {
 *          "status": 400,
 *          "message": "Invalid id"
 *      }
 */

/**
 * @apiDefine incorrectFieldsError 
 * @apiError (400) {Object[]} incorrectFields The fields were not filled in according to our business rule
 */

/**
 * @apiDefine invalidTokenError
 * @apiError (403) {Object} invalidToken The token inserted is invalid.
 */

/**
 * @apiDefine invalidTokenErrorExample
 * @apiErrorExample {json} Invalid token error
 *  HTTPS/1.1 403 Forbidden
 *  {
*      "status": 403,
 *      "message": "invalid token"
 *  }
 */
/**
 * @apiDefine incorrectCredentialsErrorExample
 * @apiErrorExample {json} Incorrect credentials: 
 *  HTTPS/1.1 401 Unauthorized
 *  {
 *      "message": "Incorrect credentials",
 *      "status": 409
 *  }
 */

/**
 * @apiDefine profileExample
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      "id": 5,
 *      "name": "Joao",
 *      "surname": "Silva",
 *      "email": "joao1980@gmail.com",
 *      "biography": null,
 *      "label": null,
 *      "website": null,
 *      "image": null,
 *      "profission": null,
 *      "company": null,
 *      "location": null
 *  }
*/

/**
 * @apiDefine tokenHeader
 * @apiHeader {String} x-access-token Token for authentication.
 */

/**
 * @apiDefine tokenExample
 * @apiExample {header} Token header:
 *  "x-access-token": "Bearer <TOKEN>"
 */

/**
* @api {get} profile 2.1. Get profile
* 
* @apiVersion 1.5.1
* @apiGroup 2. Profile
* 
* @apiUse tokenHeader
* @apiUse tokenExample
* 
* @apiSuccess (200) {Number} id User identification code.
* @apiSuccess (200) {String} name User name.
* @apiSuccess (200) {String} surname User last name.
* @apiSuccess (200) {String} email User email.
* @apiSuccess (200) {String} [biography] User biography.
* @apiSuccess (200) {String} [label] User characteristic.
* @apiSuccess (200) {String} [website] User website.
* @apiSuccess (200) {String} [image] Profile picture link.
* @apiSuccess (200) {String} [profission] User profission.
* @apiSuccess (200) {String} [company] User company name.
* @apiSuccess (200) {Object} [location] User location.
* @apiSuccess (200) {String} location[city] User city.
* @apiSuccess (200) {Object} location[geolocation] User geolocation.
* @apiSuccess (200) {Number} geolocation[latitude] Geolocation latitude.
* @apiSuccess (200) {Number} geolocation[longitude] Geolocation longitude.
* 
* @apiUse profileExample
* 
* @apiUse noTokenError
* @apiUse noTokenErrorExample
* @apiUse invalidTokenError
* @apiUse invalidTokenErrorExample
*/
profileRoutes.get('/profile', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readProfile(user)
                .then((result: UserResponse) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {post} profile 2.3. Upload profile picture
 * 
 * @apiVersion 1.5.1
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Form data params) {image} imageProfile Profile picture
 * 
 * @apiExample {FormData} form-data:
 *  imageProfile: <image>
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      "id": 5,
 *      "name": "Joao",
 *      "surname": "Silva",
 *      "email": "joao1980@gmail.com",
 *      "biography": null,
 *      "label": null,
 *      "website": null,
 *      "image": "https://images.com/1",
 *      "profission": null,
 *      "company": null
 *  }
 * 
 *  
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiUse incorrectFieldsError
 * @apiErrorExample Incorrect Field:
 *  HTTPS/1.1 400 Bad Request
 *  { 
 *      "message": "This file format is not accept here, only .jpg and .png" 
 *  }
 */
profileRoutes.post('/profile', formData.single('imageProfile'), validateImage, (request, response) => {
    const image = request.file;

    getUserByRequest(request)
        .then(user => {
            controller.updateImage(user, image)
                .then((result: UserResponse) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});


/**
 * @api {put} profile 2.2. Update profile
 * 
 * @apiVersion 1.4.11
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Request body params) {String{3..100}} [name_to] New user name.
 * @apiParam (Request body params) {String{3..100}} [surname_to] New user last name.
 * @apiParam (Request body params) {String{..255}} [biography_to] New user biography.
 * @apiParam (Request body params) {String{..30}} [label_to] New user label.
 * @apiParam (Request body params) {String{..100}} [profission_to] New user profission.
 * @apiParam (Request body params) {String{..100}} [company_to] New user company.
 * @apiParam (Request body params) {String{..255}} [website_to] New user website.
 * @apiParam (Request body params) {Object} [location_to] New user location.
 * @apiParam (Request body params) {String{2}} location[uf] New user UF.
 * @apiParam (Request body params) {String{..100}} location[city] New user city.
 * @apiParam (Request body params) {Object} location[geolocation] New user geolocation.
 * @apiParam (Request body params) {Number} geolocation[latitude] New latitude.
 * @apiParam (Request body params) {Number} geolocation[longitude] New longitude.
 * 
 * @apiExample {json} Request body:
 *  {
 *      "name_to": "Pedro",
 *      "surname_to": "Santiago",
 *      "biography_to": "Um jovem que gosta de eventos de jogos.",
 *      "label_to": "gamer",
 *      "profission_to": "Estudante",
 *      "website_to": "https://www.pedrogames.com",
 *      "location_to": {
 *          "uf": "SP",
 *          "city": "Praia Grande",
 *          "geolocation": {
 *              "latitude": -24.0089,
 *              "longitude": -46.4125
 *          }
 *      }
 *  }
 * 
 * @apiSuccess (200) {Number} id User identification code.
 * @apiSuccess (200) {String} name User name.
 * @apiSuccess (200) {String} surname User last name.
 * @apiSuccess (200) {String} email User email.
 * @apiSuccess (200) {String} [biography] User biography.
 * @apiSuccess (200) {String} [label] User characteristic.
 * @apiSuccess (200) {String} [website] User website.
 * @apiSuccess (200) {String} [image] Profile picture link.
 * @apiSuccess (200) {String} [company] User company name.
 * @apiSuccess (200) {Object} [location] User location.
 * @apiSuccess (200) {String} location[city] User city.
 * @apiSuccess (200) {Object} location[geolocation] User geolocation.
 * @apiSuccess (200) {Number} geolocation[latitude] Geolocation latitude.
 * @apiSuccess (200) {Number} geolocation[longitude] Geolocation longitude.
 * 
 * @apiSuccessExample {json} Success response:
 *   HTTPS/1.1 200 OK
 *   {
 *      "id": 5,
 *      "name": "Pedro",
 *      "surname": "Santiago",
 *      "email": "joao1980@gmail.com",
 *      "biography": "Um jovem que gosta de eventos de jogos.",
 *      "label": "gamer",
 *      "website": "https://www.pedrogames.com",
 *      "image": null,
 *      "company": null,
 *      "location": {
 *          "city": "Praia Grande",
 *          "uf": "SP",
 *          "geolocation": {
 *              "latitude": "-24.00890",
 *              "longitude": "-46.41250"
 *          }
 *      }
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
 */
profileRoutes.put('/profile', validate, (request, response) => {
    const updateUser: UpdateUserRequest = request.body;

    getUserByRequest(request).then(user => {
        controller.updateUser(user, updateUser)
            .then((result: UserResponse) => response.status(200).json(result))
            .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} profile 2.5. Delete user
 * 
 * @apiVersion 1.4.11
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Request body param) {String} email User email
 * @apiParam (Request body param) {String{8..}} passowrd user password
 * 
 * @apiExample {json} Request body:
 *  {
 *      "email": "joao@gmail.com",
 *      "password": "joaoPassword"
 *  }
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  
 * 
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiError (400) {Object} incorrectCredentials Credentials inserted are incorrect
 * @apiUse incorrectCredentialsErrorExample
 * @apiUse incorrectFieldsError
 */
profileRoutes.delete('/profile', validate, (request, response) => {
    const credentials: CredentialsRequest = request.body;

    getUserByRequest(request)
        .then(user => {
            controller.deleteUser(user, credentials)
                .then(() => response.status(200).json())
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {patch} profile 2.4. Update password
 * 
 * @apiVersion 1.4.11
 * @apiName PATCH profile
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam (Request body params) {String} password User password
 * @apiParam (Request body params) {String{8..}} newPassowrd New password
 * 
 * @apiExample {json} Request body:
 *  {
 *      "password": "joaoPassword",
 *      "newPassword": "joao1234"
 *  }
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  
 * @apiUse noTokenError
 * @apiUse noTokenErrorExample
 * @apiUse invalidTokenError
 * @apiUse invalidTokenErrorExample
 * @apiError (401) {Object} invalidPassword Password inserted is invalid
 * @apiErrorExample Incorrect password error:
 *  HTTPS/1.1 401 Unauthorized
 *  {
 *      "message": "Invalid password",
 *      "status": 401
 *  }
 */
profileRoutes.patch('/profile', validate, (request, response) => {
    const password: updatePassword = request.body;

    getUserByRequest(request).then(user => {
        controller.updatePassword(user, password)
            .then(() => response.status(200).json())
            .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default profileRoutes;
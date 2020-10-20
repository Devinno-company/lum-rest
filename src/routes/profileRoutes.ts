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

const profileRoutes = express.Router();
const controller = new ProfileController();
const formData = multer();

/**
 * @apiDefine noTokenError
 * @apiErrorExample {json} No token error:
 *  HTTPS/1.1 403 Forbidden
 *  {
 *      "message": "none token provided"
 *  }
 */

/**
 * @apiDefine invalidTokenError
 * @apiErrorExample {json} Invalid token error:
 *  HTTPS/1.1 403 Forbidden
 *  {
 *      "message": "invalid token"
 *  }
 */
/**
 * @apiDefine incorrectCredentialsError
 * @apiErrorExample {json} Incorrect credentials: 
 *  HTTPS/1.1 403 Unauthorized
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
 *      "profission": null,rnote
 *      "company": null
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
 * @api {get} profile Get profile
 * 
 * @apiVersion 1.4.11
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiSuccess (200) {Number} id User identification code.
 * @apiSuccess (200) {String} name User name.
 * @apiSuccess (200) {String} surname User last name.
 * @apiSuccess (200) {String} email User email.
 * @apiSuccess (200) {String} biography User biography.
 * @apiSuccess (200) {String} label User characteristic.
 * @apiSuccess (200) {String} website User website.
 * @apiSuccess (200) {String} image Profile picture link.
 * @apiSuccess (200) {String} profission User profission.
 * @apiSuccess (200) {String} company User company name.
 * 
 * @apiUse profileExample
 * 
 * @apiUse noTokenError
 * @apiUse invalidTokenError
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
 * @api {post} profile Upload profile picture
 * 
 * @apiVersion 1.4.11
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam {image} imageProfile Profile picture
 * 
 * @apiExample {FormData} form-data:
 *  imageProfile: <image>
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  
 * @apiUse noTokenError
 * @apiUse invalidTokenError
 * @apiErrorExample Incorrect password error:
 *  HTTPS/1.1 401 Unauthorized
 *  {
 *      "message": "Invalid password",
 *      "status": 401
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
 * @api {put} profile Update profile
 * 
 * @apiVersion 1.4.11
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam {String{3..100}} [name_to] New user name.
 * @apiParam {String{3..100}} [surname_to] New user last name.
 * @apiParam {String{..255}} [biography_to] New user biography.
 * @apiParam {String{..30}} [label_to] New user label.
 * @apiParam {String{..100}} [profission_to] New user profission.
 * @apiParam {String{..100}} [company_to] New user company.
 * @apiParam {String{..255}} [website_to] New user website.
 * @apiParam {Object} [location_to] New user location.
 * @apiParam {String{..100}} location_to[city] New user city.
 * @apiParam {Object} location_to[geolocation] New user geolocation.
 * @apiParam {Number} geolocation[latitude] New latitude.
 * @apiParam {Number} geolocation[longitude] New longitude.
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
 * @apiSuccess (200) {String} biography User biography.
 * @apiSuccess (200) {String} label User characteristic.
 * @apiSuccess (200) {String} website User website.
 * @apiSuccess (200) {String} image Profile picture link.
 * @apiSuccess (200) {String} company User company name.
 * @apiSuccess (200) {Object} location User location.
 * @apiSuccess (200) {String} location_to[city] User city.
 * 
 * @apiSuccess (200) {Object} location_to[geolocation] User geolocation.
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
 * @apiUse invalidTokenError
 */
profileRoutes.put('/profile', validate, (request, response) => {
    const updateUser: UpdateUserRequest = request.body;

    getUserByRequest(request).then(user => {
        controller.updateUser({ user, updateUser })
            .then((result: UserResponse) => response.status(200).json(result))
            .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {delete} profile Delete user
 * 
 * @apiVersion 1.4.11
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam {String} email User email
 * @apiParam {String{8..}} passowrd user password
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
 * @apiUse invalidTokenError
 * @apiUse incorrectCredentialsError
 */
profileRoutes.delete('/profile', validate, (request, response) => {
    const credentials = request.body;

    getUserByRequest(request)
        .then(user => {
            controller.deleteUser(user, credentials)
                .then(() => response.status(200).json())
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {patch} profile Update password
 * 
 * @apiVersion 1.4.11
 * @apiName PATCH profile
 * @apiGroup 2. Profile
 * 
 * @apiUse tokenHeader
 * @apiUse tokenExample
 * 
 * @apiParam {String} password User password
 * @apiParam {String{8..}} newPassowrd New password
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
 * @apiUse invalidTokenError
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
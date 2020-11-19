import express, { request } from 'express';
import multer, { Field } from 'multer';
import UserController from "../controller/UserController";
import Credentials from '../interfaces/request/CredentialsRequest';
import NewUser from "../interfaces/request/NewUserRequest";
import validate from "../middleware/inputValidation";
import verifyToken from '../middleware/verifyToken';
import getUserByRequest from '../utils/getUserByRequest';

const userRoutes = express.Router();

const controller = new UserController();

/**
 * @api {post} users 1.1. Register
 * 
 * @apiVersion 1.4.11
 * @apiGroup 1. System
 * 
 * @apiExample {json} Request body
 *  { 
 *      "name": "João", 
 *      "surname": "Silva", 
 *      "email": "joao@gmail.com", 
 *      "password": "joaoPassword" 
 *  }
 * 
 * @apiParam (Request body params) {String{3..100}} name User name.
 * @apiParam (Request body params) {String{3..100}} surname User last name.
 * @apiParam (Request body params) {String} email User email.
 * @apiParam (Request body params) {String{8..}} password User password.
 * 
 * @apiSuccess (201) {String} token Token for authentication.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 201 CREATED
 *  {
 *      "token": "eyJhbGciOiJIUzI1NiIvInR5cCI6IkpXVCJ4.eyJpZCI6NRwiaWF0IjoxNjAyMTgyNDUyfQ.MR_ehSSQTe9-yVoSe1RAGQZnV6ygLCV4-vcxajBAeaq"
 *  }
 * 
 * @apiUse incorrectFieldsError
 * @apiErrorExample {json} Incorrects fields:
 *  HTTPS/1.1 400 Bad Request
 *  [
 *      {
 *          "label": "name",
 *          "message": "This field is required"
 *      },
 *      {
 *          "label": "surname",
 *          "message": "This field is string type"
 *      },
 *      {
 *          "label": "email",
 *          "message": "This string is invalid for email type"
 *      },
 *      {
 *          "label": "password",
 *          "message": "The name must have on minimum 8 characters"
 *      }
 *   ]
 */
userRoutes.post('/users', validate, (request, response) => {
    const newUser: NewUser = request.body

    controller.newUser(newUser)
        .then((result: any) => response.status(201).json(result))
        .catch((err: any) => response.status(err.status || 400).json(err));
});


/**
 * @api {post} login 1.2. Log in
 * 
 * @apiVersion 1.4.11
 * @apiGroup 1. System
 * 
 * @apiExample {json} Request body
 *  {
 *      "email": "joao@gmail.com", 
 *      "password": "joaoPassword" 
 *  }
 * 
 * @apiParam (Request body params) {String} email User email.
 * @apiParam (Request body params) {String{8..}} password User password.
 * 
 * @apiSuccess (200) {String} token Token for authentication.
 * 
 * @apiSuccessExample {json} Success Response:
 *  HTTPS/1.1 200 OK
 *  {
 *      "token": "eyJhbGciOiJIUzI1NiIvInR5cCI6IkpXVCJ4.eyJpZCI6NRwiaWF0IjoxNjAyMTgyNDUyfQ.MR_ehSSQTe9-yVoSe1RAGQZnV6ygLCV4-vcxajBAeaq"
 *  }
 * 
 * @apiUse incorrectFieldsError
 * @apiError (401) {Object} incorrectCredentials Invalid credentials
 * 
 * @apiErrorExample {json} Incorrect fields:
 *  HTTPS/1.1 400 Bad Request
 *  [
 *      {
 *          "label": "email",
 *          "message": "This string is invalid for email type"
 *      },
 *      {
 *          "label": "password",
 *          "message": "The name must have on minimum 8 characters"
 *      }
 *  ]
 * 
 * @apiUse incorrectCredentialsErrorExample
 */
userRoutes.post('/login', validate, (request, response) => {
    const credentials: Credentials = request.body;

    controller.login(credentials)
        .then((result: { token: string }) => response.status(200).json(result))
        .catch((err: any) => response.status(err.status || 400).json(err));
});

/**
 * @api {get} users 2.1. Get user by email
 * 
 * @apiVersion 1.5.1
 * @apiGroup 2. Users
 * 
 * @apiParam (Request body params) {String} email User email.
 * @apiExample {json} Request body:
 *  {
 *      "email": "joao1980@gmail.com"
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
 * @apiError (404) userNotFound No registered user with this email
 * @apiErrorExample
 *  HTTPS/1.1 404 Not Found
 *      {
 *          "status": 404,
 *          "message": "This user don't exists"
 *      }
 */
userRoutes.get('/users', validate, (request, response) => {

    controller.readUserByEmail(request.body.email)
        .then((result) => response.status(200).json(result))
        .catch((err) => response.status(err.status || 400).json(err));
});

userRoutes.post('/forgotPassword', (request, response) => {

    controller.forgotPassword(request.body.email)
        .then((result) => response.status(200).json(result))
        .catch((err) => response.status(err.status || 400).json(err));
});

userRoutes.post('/recoveryPassword', (request, response) => {

    controller.recoveryPassword(request.query.token as string, request.body.newPassword)
        .then(() => response.status(200).json())
        .catch((err) => response.status(err.status || 400).json(err));
});


export default userRoutes;
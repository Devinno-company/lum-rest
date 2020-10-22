import express from 'express';
import UserController from "../controller/UserController";
import Credentials from '../interfaces/request/CredentialsRequest';
import NewUser from "../interfaces/request/NewUserRequest";
import validate from "../middleware/inputValidation";

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

export default userRoutes;
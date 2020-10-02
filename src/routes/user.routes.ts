import validate from "../middleware/validation.middleware";
import express from 'express';
import NewUser from "../interfaces/request/NewUser";
import UserController from "../controller/User.controller";
import Credentials from "../interfaces/request/Credentials";

const userRoutes = express.Router();

const controller = new UserController();

userRoutes.post('/users', validate, (request, response) => {
    const newUser: NewUser = request.body

    controller.newUser(newUser)
        .then((result: any) => response.status(201).json(result))
        .catch((err: any) => response.status(err.status || 400).json(err));
});

userRoutes.post('/login', validate, (request, response) => {
    const credentials: Credentials = request.body;
    
    controller.login(credentials)
        .then((result: { token: string }) => response.status(200).json(result))
        .catch((err: any) => response.status(err.status || 400).json(err));
});

export default userRoutes;
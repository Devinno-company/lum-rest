import validate from "../middleware/validation.middleware";
import express from 'express';
import UpdateUser from "../interfaces/request/UpdateUser";
import ProfileController from "../controller/Profile.controller";
import UserResponse from "../interfaces/response/UserResponse";
import updatePassword from "../interfaces/request/UpdatePasswors";
import verifyToken from "../middleware/verifyToken.middleware";
import getUserByRequest from "../utils/getUserByRequest";

const profileRoutes = express.Router();

const controller = new ProfileController();

profileRoutes.get('/profile', verifyToken, (request, response) => {

    getUserByRequest(request)
        .then(user => {
            controller.readProfile(user)
                .then((result: UserResponse) => response.status(200).json(result))
                .catch((err: any) => response.status(err.status || 400).json(err));
        })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

profileRoutes.put('/profile', validate, (request, response) => {
    const updateUser: UpdateUser = request.body;

    getUserByRequest(request).then(user => {
        controller.updateUser({ user, updateUser })
            .then((result: UserResponse) => response.status(200).json(result))
            .catch((err: any) => response.status(err.status || 400).json(err));
    })
        .catch((err: any) => response.status(err.status || 400).json(err));
});

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
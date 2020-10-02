import { Request } from "express";
import jsonwebtoken from 'jsonwebtoken';
import User from "../models/User";
import UserRepository from "../repositorys/User.repository";

function getUserByRequest(request: Request): Promise<User> {
    return new Promise(async (resolve, reject) => {
        const token = request.headers['x-access-token'] as string;

        if (token) {
            const tokenDecoded: any = jsonwebtoken.decode(token.replace('Bearer ', ''));
            const idUser = tokenDecoded.id;
            
            await UserRepository.findUserById(idUser)
                .then(user => resolve(user))
                .catch(() => reject({ message: 'Invalid token. Renew it', status: 400 }));
        } else
            reject({ message: 'No token provided', status: 400 });
    });
}

export default getUserByRequest;
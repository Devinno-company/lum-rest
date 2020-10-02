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
            const user = await UserRepository.findUserById(idUser);

            resolve(user);
        } else
            reject('Invalid token. Renew it');
    });
}

export default getUserByRequest;
import jsonwebtoken from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

function verifyToken(request: Request, response: Response, next: NextFunction) {

    /* CAPTURA O CONTEUDO DO HEADER DE AUTORIZAÇÃO */
    const authorizationHeader = request.headers['x-access-token'] as string;

    if (!authorizationHeader)
        response.status(403).json({ message: 'none token provided' });
    else {
        const token = authorizationHeader.replace('Bearer ', '');

        /* VERFIICA SE O TOKEN É VALIDO */
        jsonwebtoken.verify(token, process.env.SECRET as string, (err) => {
            if (!err)
                next();
            else
                response.status(403).json({ message: 'invalid token' });
        });
    }
}

export default verifyToken;
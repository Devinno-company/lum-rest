import { Request, Response, NextFunction } from "express";

function validateImage(request: Request, response: Response, next: NextFunction) {
    
    if (!request.file) {
        response.status(400).json({ message: 'Label \'imageProfile\' in FormData is required.' });
        response.end();
    } else {
        if (request.file.mimetype != 'image/jpeg' && request.file.mimetype != 'image/jpg' && request.file.mimetype != 'image/png') {
            response.status(400).json({ message: 'This file format is not accept here, only .jpg and .png' });
            response.end();
        } else {
            next();
        }
    }
}

export default validateImage;
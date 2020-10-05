import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import credentialsSchema from "../schema/credentials.schema";
import { newUserSchema, updateUserSchema } from "../schema/user.schema";
import updatePasswordSchema from "../schema/updatePassword.schema";

const optionsValidation: Joi.ValidationOptions = {
    abortEarly: false,
    convert: false,
    dateFormat: 'date',
}

function getErrorsResponse(errors: Joi.ValidationError) {
    const errorsResponse: Array<{ label: string, message: string }> = [];

    /* VERIFICA QUAIS OS CAMPOS ESTÃO INVÁLIDOS E QUAL OS MOTIVOS */
    errors.details.map(item => {
        if (item.context && item.context.label) {
            const label = item.context.label;

            let message = '';
            switch (item.type) {
                case 'any.required':
                    message = 'This field is required';
                    break;
                case 'string.base':
                    message = 'This field is string type';
                    break;
                case 'string.min':
                    message = `The name must have on minimum ${item.context.limit} characters`;
                    break;
                case 'string.max':
                    message = `The name must have on maximum ${item.context.limit} characters`;
                    break;
                case 'string.email':
                    message = 'This string is invalid for email type';
                    break;
                case 'string.empty':
                    message = 'This string is not be empty';
                    break;
                default:
                    console.log(item);
                    message = 'Unknow error';
            }

            errorsResponse.push({ label, message });
        }
    });

    return errorsResponse;
}

function validate(request: Request, response: Response, next: NextFunction) {
    const route = request.path.toLowerCase();
    const method = request.method.toLowerCase();

    let schema = null;
    /** DEFINE QUAL SCHEMA SERÁ UTILIZADO PARA VALIDAÇÃO */
    switch (route) {
        case '/users':
            schema = newUserSchema;
            break;
        case '/login':
            schema = credentialsSchema;
            break;
        // /profile
        default:
            switch (method) {
                case 'put':
                    schema = updateUserSchema;
                    break;
                case 'delete':
                    schema = credentialsSchema;
                    break;
                // patch
                default:
                    schema = updatePasswordSchema;
            }
            break;
    }

    /* VALIDA OS DADOS RECEBIDOSS */
    const { error } = schema.validate(request.body, optionsValidation);

    if (!error) {
        next();
    } else {
        const errorsResponse = getErrorsResponse(error);

        response.status(400).json(errorsResponse);
        response.end();
    }
}

export default validate;
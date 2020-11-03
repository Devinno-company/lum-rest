import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import credentialsSchema from "../schema/credentialsSchema";
import { getUserByEmailSchema, newUserSchema, updateUserSchema } from "../schema/userSchema";
import updatePasswordSchema from "../schema/updatePasswordSchema";
import { newEventSchema, updateEventSchema } from "../schema/eventSchema";
import { newInviteSchema, updateInviteSchema } from "../schema/inviteSchema";
import updateRoleTeamMemberSchema from "../schema/teamSchema";
import { newNoticeSchema, updateNoticeSchema } from "../schema/noticeSchema";
import { Route53Resolver } from "aws-sdk";
import { newTaskSchema, updateTaskSchema } from "../schema/taskSchema";

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
                case 'number.base':
                    message = 'This field is number type';
                    break;
                case 'number.min':
                    message = `The minimum value of this field is ${item.context.limit}`;
                    break;
                case 'number.max':
                    message = `The maximum value of this field is ${item.context.limit}`;
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
                case 'string.uppercase':
                    message = 'This field only accepts strings in uppercase';
                    break;
                case 'object.unknown':
                    message = 'This field is not accepted at this end point';
                    break;
                case 'object.base':
                    message = "This fiels is a object type. See our documentation";
                    break;
                case 'string.pattern.base':

                    if (item.context.label == 'cep')
                        message = 'This format is invalid for cep';
                    else if (item.context.label.includes('date'))
                        message = 'This format is invalid for date';
                    else if (item.context.label.includes('time'))
                        message = 'This format is invalid for time';
                    else {
                        message = 'This value is invalid for this field. See our documentation.';
                    }
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
        case '/users/':
        case '/users':
            switch (method) {
                case 'post':
                    schema = newUserSchema;
                    break;
                // get
                default:
                    schema = getUserByEmailSchema;
            }
            break;
        case '/login/':
        case '/login':
            schema = credentialsSchema;
            break;
        case '/events/':
        case '/events':
            schema = newEventSchema;
            break;
        case '/profile/':
        case '/profile':
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
        default:
            /* /events/:idEvent/invite */
            if (route.includes('/events/') && route.includes('/invite'))
                schema = newInviteSchema;
            /* /events/:idEvent/team */
            else if (route.includes('/events/') && route.includes('/team') && method == 'patch')
                schema = updateRoleTeamMemberSchema;
            /* /events/:idEvent/notices */
            else if (route.includes('/events/') && route.includes('/notices') && method == 'post')
                schema = newNoticeSchema;
            else if (route.includes('/events/') && route.includes('/notices') && method == 'put')
                schema = updateNoticeSchema;
            /* /invites/:idInvite */
            else if (route.includes('/invites') && method == 'patch')
                schema = updateInviteSchema;
            else if (route.includes('/events/') && route.includes('/tasks') && method == 'post')
                schema = newTaskSchema;
            else if (route.includes('/events/') && route.includes('/tasks') && method == 'put')
                schema = updateTaskSchema;
            /* /events/:idEvent */
            else
                schema = updateEventSchema;
    }

    /* Validate the received data */
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
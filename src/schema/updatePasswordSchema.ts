import Joi from "joi";

export const updatePasswordSchema = Joi.object({

    password: Joi.string()
        .min(8)
        .max(255)
        .required(),

    newPassword: Joi.string()
        .min(8)
        .max(255)
        .required()
})
    .strict()
    .unknown();

export default updatePasswordSchema;
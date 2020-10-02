import Joi from "joi";

export const newUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    surname: Joi.string()
        .min(3)
        .max(100)
        .required(),

    email: Joi.string()
        .email()
        .max(255)
        .required(),

    password: Joi.string()
        .min(8)
        .max(255)
        .required()
})
    .strict()
    .unknown();

export const updateUserSchema = Joi.object({
    name_to: Joi.string()
        .min(3)
        .max(100)
        .optional(),

    surname_to: Joi.string()
        .min(3)
        .max(100)
        .optional(),

    biography_to: Joi.string()
        .min(0)
        .max(255)
        .optional(),

    label_to: Joi.string()
        .min(0)
        .max(30)
        .optional(),

    profission_to: Joi.string()
    .min(0)
    .max(100)
    .optional(),

    company_to: Joi.string()
        .min(0)
        .max(100)
        .optional(),
    
    website_to: Joi.string()
        .min(0)
        .max(255)
        .optional(),
})
    .strict()
    .unknown();
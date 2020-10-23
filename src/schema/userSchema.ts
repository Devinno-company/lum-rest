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
        .allow(null, '')
        .optional(),

    surname_to: Joi.string()
        .min(3)
        .max(100)
        .allow(null, '')
        .optional(),

    biography_to: Joi.string()
        .min(0)
        .max(255)
        .allow(null, '')
        .optional(),

    label_to: Joi.string()
        .min(0)
        .max(30)
        .allow(null, '')
        .optional(),

    profission_to: Joi.string()
        .min(0)
        .max(100)
        .allow(null, '')
        .optional(),

    company_to: Joi.string()
        .min(0)
        .max(100)
        .allow(null, '')
        .optional(),

    website_to: Joi.string()
        .min(0)
        .max(255)
        .allow(null, '')
        .optional(),

    location_to: Joi.object({
        geolocation: Joi.object({
            latitude: Joi.number()
                .required(),
            longitude: Joi.number()
                .required()
        })
        .required(),
        city: Joi.string()
            .min(0)
            .max(100)
            .required(),
        
        uf: Joi.string()
            .min(2)
            .max(2)
            .case("upper")
            .required()
    })
    .optional()
    .allow(null)
})
    .strict()
    .unknown();

export const getUserByEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(255)
        .required(),
})
.unknown()
.strict();
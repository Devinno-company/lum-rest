import Joi from "joi";

export const newTaskSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .min(0)
        .max(255)
        .allow(null, '')
        .optional()
})
    .strict();

export const updateTaskSchema = Joi.object({
    name_to: Joi.string()
        .min(3)
        .max(100)
        .optional(),

    description_to: Joi.string()
        .min(0)
        .max(255)
        .allow(null, '')
        .optional()
})
    .strict();
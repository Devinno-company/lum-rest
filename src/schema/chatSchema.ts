import Joi from "joi";

export const newChatSchema = Joi.object({
    event_id: Joi.number()
        .required(),

    message: Joi.string()
        .max(255)
        .required()
})
    .strict();

export const newMessageSchema = Joi.object({
    message: Joi.string()
        .max(255)
        .required()
})
    .strict();
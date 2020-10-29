import Joi from "joi";

export const newInviteSchema = Joi.object({
    guest_email: Joi.string()
        .email()
        .max(255)
        .required(),

    role: Joi.string()
        .min(3)
        .max(3)
        .case("upper")
        .required()
})
    .strict();

export const updateInviteSchema = Joi.object({
    choice: Joi.string()
        .min(6)
        .max(6)
        .required()
})
    .strict();

import Joi from "joi";

export const newNoticeSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .min(3)
        .max(255)
        .required(),

    priority: Joi.number()
        .min(1)
        .required(),

    urgency: Joi.string()
        .min(3)
        .max(3)
        .case('upper')
        .required()
})
.strict();

export const updateNoticeSchema = Joi.object({

    name_to: Joi.string()
        .min(3)
        .max(100)
        .optional(),

    description_to: Joi.string()
        .min(3)
        .max(255)
        .optional(),

    priority_to: Joi.number()
        .min(1)
        .optional(),

    urgency_to: Joi.string()
        .min(3)
        .max(3)
        .case('upper')
        .optional()
})
.strict();
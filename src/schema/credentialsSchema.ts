import Joi from "joi";

const credentialsSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(255)
        .required(),

    password: Joi.string()
        .min(8)
        .max(255)
        .required()
})
    .strict();
    
export default credentialsSchema;
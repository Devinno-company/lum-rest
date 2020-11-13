import Joi from "joi"

export const newEventSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required(),

    start_date: Joi.string()
        .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
        .required(),

    end_date: Joi.string()
        .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
        .required(),

    description: Joi.string()
        .min(0)
        .max(255)
        .allow('', null)
        .optional(),

    start_time: Joi.string()
        .min(5)
        .max(5)
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .allow('', null)
        .optional(),

    end_time: Joi.string()
        .min(5)
        .max(5)
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .allow('', null)
        .optional(),

    type: Joi.string()
        .min(0)
        .max(100)
        .allow('', null)
        .optional(),

    location: Joi.object({
        street: Joi.string()
            .min(3)
            .max(120)
            .required(),

        neighborhood: Joi.string()
            .min(3)
            .max(100)
            .required(),

        number: Joi.number()
            .required(),

        cep: Joi.string()
            .min(8)
            .max(8)
            .regex(/^\d[0-9]{7}$/)
            .required(),

        complement: Joi.string()
            .min(0)
            .max(50)
            .optional(),

        geolocation: Joi.object({
            latitude: Joi.number()
                .required(),
            longitude: Joi.number()
                .required(),
        })
            .required(),

        city: Joi.string()
            .min(3)
            .max(100)
            .required(),

        uf: Joi.string()
            .min(2)
            .max(2)
            .case("upper")
            .required()
    })
    .required(),

    privacy: Joi.string()
        .regex(/^PRI\b$|^PUB\b$/)
        .min(3)
        .max(4)
        .required(),

    category: Joi.string()
        .min(3)
        .max(3)
        .required()
})
    .strict();
    
export const updateEventSchema = Joi.object({
    name_to: Joi.string()
    .min(3)
    .max(100)
    .optional(),

    description_to: Joi.string()
        .min(0)
        .max(255)
        .allow('', null)
        .optional(),

    date_start_to: Joi.string()
        .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
        .optional(),

    date_end_to: Joi.string()
        .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
        .optional(),

    hour_start_to: Joi.string()
        .min(5)
        .max(5)
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .allow('', null)
        .optional(),

    hour_end_to: Joi.string()
        .min(5)
        .max(5)
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .allow('', null)
        .optional(),

    type_to: Joi.string()
        .min(0)
        .max(100)
        .allow('', null)
        .optional(),

    location_to: Joi.object({
        street_to: Joi.string()
            .min(3)
            .max(120)
            .required(),

        neighborhood_to: Joi.string()
            .min(3)
            .max(100)
            .required(),

        number_to: Joi.number()
            .required(),

        cep_to: Joi.string()
            .min(8)
            .max(8)
            .regex(/^\d[0-9]{7}$/)
            .required(),

        complement_to: Joi.string()
            .min(0)
            .max(50)
            .optional(),

        geolocation: Joi.object({
            latitude: Joi.number()
                .required(),
            longitude: Joi.number()
                .required(),
        })
            .required(),

        city: Joi.string()
            .min(3)
            .max(100)
            .required(),

        uf: Joi.string()
            .min(2)
            .max(2)
            .case("upper")
            .required()
    })
    .optional(),

    privacy_to: Joi.string()
        .regex(/^PRI\b$|^PUB\b$/)
        .min(3)
        .max(3)
        .optional(),

    category_to: Joi.string()
        .min(3)
        .max(3)
        .optional()
})
.strict();
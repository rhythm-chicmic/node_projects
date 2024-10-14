const Joi = require('joi');

const schema = {
    blogPOST: Joi.object({
        title: Joi.string().required() ,
        description: Joi.string().required(),
        year: Joi.number()
    }),
    blogLIST: Joi.object().keys({
        page: Joi.number().required(),
        pageSize: Joi.number().required()
    }),
    blogDETAILS: Joi.object().keys({
        id: Joi.number().min(1).required()
    })

};

module.exports = schema;
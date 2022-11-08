const Joi = require('joi')

module.exports.clientValidator = Joi.object({
    firstName: Joi.string().alphanum().required(),
    lastName: Joi.string().alphanum().required(),
    sex: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    birthDate: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    address: Joi.string().required(),
    bloodPressure: Joi.string().optional().allow(''),
    glucoseLevel: Joi.string().optional().allow(''),
    archived: Joi.boolean(),
    prescription: Joi.string(),
    password: Joi.string()
}).unknown(true);
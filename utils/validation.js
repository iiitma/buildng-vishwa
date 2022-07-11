const Joi = require('@hapi/joi');


//Register Validation
const RegisterValidation = data => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).required(),
       lastname: Joi.string().min(2).required(),
       email: Joi.string().min(6).required().email(),
       password: Joi.string().min(6).required(),
       role: Joi.string().required(),
       secret: Joi.string()
    });
    return schema.validate(data)
}

//Login Validation
const LoginValidation = data => {
    const schema = Joi.object({
       email: Joi.string().min(6).required().email(),
       password: Joi.string().min(6).required()
    });
    return schema.validate(data)
}

//ResetLink Validation
const ResetLinkValidation = data => {
    const schema = Joi.object({
       email: Joi.string().min(6).required().email(),
    });
    return schema.validate(data)
}


module.exports = {
    ResetLinkValidation,
    LoginValidation,
    RegisterValidation
}
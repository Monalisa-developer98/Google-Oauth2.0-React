const Joi = require('joi');
const Responses = require('../helpers/response');

const createUserValidator = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            name: Joi.string()
                .pattern(/^[a-zA-Z\s]+$/)
                .min(4)
                .required()
                .messages({
                    'string.pattern.base': 'Name must only contain letters and spaces.',
                    'string.empty': 'Name is required.',
                    'any.required': 'Name is required.',
                    'string.min': 'Name must be at least {#limit} characters long.'
                }),
            email: Joi.string().email().required()
                .messages({
                    'string.email': 'Email must be a valid email address.',
                    'string.empty': 'Email is required.',
                    'any.required': 'Email is required.',
                }),
            phone: Joi.string()
                .pattern(/^[0-9]{10}$/) 
                .length(10)            
                .required()
                .messages({
                    'string.pattern.base': 'Phone number must only contain exactly 10 digits.',
                    'string.empty': 'Phone number is required.',
                    'any.required': 'Phone number is required.',
                    'string.length': 'Phone number must be exactly {#limit} digits long.'
                }),           
            password: Joi.string().min(3).max(6).messages({
                'string.empty': 'Password is required.',
                'any.required': 'Password is required.',
                'string.min': 'Password must be at least {#limit} characters long.',
                'string.max': 'Password must be at most {#limit} characters long.'
            }),        
            address: Joi.string()
        });

        await bodySchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessages = error.details.map(err => err.message).join(', ');
        console.error(errorMessages);
        return Responses.errorResponse(req, res, errorMessages, 400);
    }
};


const loginWithOtpController = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
                email: Joi.string().email().required()
                .messages({
                    'string.email': 'Email must be a valid email address.',
                    'string.empty': 'Email is required.',
                    'any.required': 'Email is required.',
                }),

        });

        await bodySchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessages = error.details.map(err => err.message).join(', ');
        console.error(errorMessages);
        return Responses.errorResponse(req, res, errorMessages, 400);
    }
};

const verifyUserOTP = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            email: Joi.string().email().required()
                .messages({
                    'string.email': 'Email must be a valid email address.',
                    'string.empty': 'Email is required.',
                    'any.required': 'Email is required.',
                }),
            otp: Joi.string().required()
        });

        await bodySchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessages = error.details.map(err => err.message).join(', ');
        console.error(errorMessages);
        return Responses.errorResponse(req, res, errorMessages, 400);
    }
};

// signwithpassword
const signInByPasswordValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
                  .messages({
                  'string.min': 'Password should have a minimum length of {#limit}',
                  'string.empty': 'Password cannot be an empty field',
                  'any.required': 'Password is a required field'
          }),
      });
  
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error, 200);
    }
};

// reset password validator
const resetPasswordValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required(),
        password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
                  .messages({
                  'string.min': 'Password should have a minimum length of {#limit}',
                  'string.empty': 'Password cannot be an empty field',
                  'any.required': 'Password is a required field'
          }),
        nwpassword: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
                  .messages({
                  'string.min': 'Password should have a minimum length of {#limit}',
                  'string.empty': 'Password cannot be an empty field',
                  'any.required': 'Password is a required field'
          }),
      });
  
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error, 200);
    }
};


module.exports = {
    createUserValidator,
    loginWithOtpController,
    verifyUserOTP,
    signInByPasswordValidator,
    resetPasswordValidator
}
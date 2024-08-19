// middlewares/validationSchemas.js
const Joi = require("joi");

// Joi validation for user registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  age: Joi.number().min(0),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  hobbies: Joi.array().items(Joi.string()),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
  }),
});

// Joi validation for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Middleware for validating requests
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  validateRequest,
};

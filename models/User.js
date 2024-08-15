const mongoose = require("mongoose");
const Joi = require("joi"); // ! for validation

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  hobbies: [String],
  address: addressSchema,
});

// ? mongoose model
const User = mongoose.model("User", userSchema);

// ? Joi validation for register
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

// ? Joi validation for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// ? Middleware for validation
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports = {
  User,
  registerSchema,
  loginSchema,
  validateRequest,
};

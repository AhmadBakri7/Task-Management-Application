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

module.exports = {
  User,
};

const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Task = mongoose.model("Task", taskSchema);

const taskValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().valid("pending", "in progress", "completed").required(),
  dueDate: Joi.date().required(),
});

// Middleware function for validating the tasks
const validateTask = (req, res, next) => {
  const { error } = taskValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};

module.exports = {
  Task,
  taskValidationSchema,
  validateTask,
};

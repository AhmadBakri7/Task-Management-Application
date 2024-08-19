const Joi = require("joi");

const taskValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().valid("pending", "in progress", "completed").required(),
  dueDate: Joi.date().required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  status: Joi.string().valid("pending", "in progress", "completed").optional(),
  dueDate: Joi.date().optional(),
});

const validateTask = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};

module.exports = {
  taskValidationSchema,
  validateTask,
  updateTaskSchema,
};

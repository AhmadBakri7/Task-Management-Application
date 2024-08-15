const { Task } = require("../models/task");

exports.createTask = async (req, res) => {
  const task = new Task({
    ...req.body, // ? spread syntax (important)
    owner: req.user.id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send("Error creating task: " + error.message);
  }
};

// ? Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving tasks" });
  }
};

// ? Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params; // ! id of the task
    const updates = req.body;

    // ? Ensure the user owns the task they want to update
    const task = await Task.findOne({ _id: id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    Object.assign(task, updates); // ! take a copy of updates, then  move it to task (overwite)

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
};

// ? Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ? Ensure the user owns the task they want to delete
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(204).send(); // ? Successfully deleted
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

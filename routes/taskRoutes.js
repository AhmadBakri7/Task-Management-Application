const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { validateTask } = require("../models/task");
const router = express.Router();

router.post("/", authenticateToken, validateTask, createTask);
router.get("/", authenticateToken, getTasks);
router.put("/:id", authenticateToken, validateTask, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;

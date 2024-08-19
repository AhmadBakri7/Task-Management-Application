const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const { authenticateToken } = require("../validation/authMiddleware");
const {
  validateTask,
  updateTaskSchema,
  taskValidationSchema,
} = require("../validation/taskSchemas");
const router = express.Router();

router.post(
  "/",
  authenticateToken,
  validateTask(taskValidationSchema),
  createTask
);
router.get("/", authenticateToken, getTasks);
router.put(
  "/:id",
  authenticateToken,
  validateTask(updateTaskSchema),
  updateTask
);
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;

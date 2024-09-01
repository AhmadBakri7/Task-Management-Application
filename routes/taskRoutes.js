const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTask,
  addComment,
  uploadTaskImage,
  getTaskImage,
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

// ? Route to get task details (read-only)
router.get("/:taskId", authenticateToken, getTask);

// ? Route to add a comment to the task
router.post("/:taskId/comment", authenticateToken, addComment);

// ? Route to upload images for a task
router.post("/upload-image", authenticateToken, uploadTaskImage);

router.get("/:taskId/file/:fileId", authenticateToken, getTaskImage);

module.exports = router;

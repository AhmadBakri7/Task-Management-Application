const express = require("express");
const connectDB = require("./config/db");
const { registerUser, loginUser } = require("./controller/userController");
const { authenticateToken } = require("./middlewares/authMiddleware");
const {
  registerSchema,
  loginSchema,
  validateRequest,
} = require("./models/User");

const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

// ? Connect to the database
connectDB();

// ? Public routes
app.post("/api/users/register", validateRequest(registerSchema), registerUser);
app.post("/api/users/login", validateRequest(loginSchema), loginUser);

app.use("/api/tasks", taskRoutes);

// ? Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

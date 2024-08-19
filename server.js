const express = require("express");
const connectDB = require("./dbConnection/db");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// ? Connect to the database
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ? Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

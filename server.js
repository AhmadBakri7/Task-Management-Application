const express = require("express");
const connectDB = require("./dbConnection/db");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const inviteRoutes = require("./routes/invitationRoutes");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());

// ! // Middleware to handle file uploads with a 1MB size limit
app.use(
  fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 }, // ? 1MB file size limit
    abortOnLimit: true, // ? Abort the upload if the file is too large
  })
);

// ? Connect to the database
connectDB();

// ? Pass the WebSocket server instance to the routes
app.use((req, res, next) => {
  req.wss = wss;
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/invite", inviteRoutes);

// ? Create an HTTP server
const server = http.createServer(app);

// ? Set up WebSocket server
const wss = new WebSocket.Server({ server });

// ! WebSocket connection setup
wss.on("connection", (ws, req) => {
  const token = req.url.split("?token=")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded;
      console.log(
        `New WebSocket connection established for user: ${ws.user.email}`
      );
    } catch (err) {
      console.log("Invalid WebSocket token", err);
      ws.close();
    }
  } else {
    console.log("No token provided for WebSocket connection");
    ws.close();
  }

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// ? Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

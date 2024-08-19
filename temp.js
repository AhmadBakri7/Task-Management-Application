const express = require("express");
const app = express();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Static files middleware
app.use(express.static("public"));

// Route-specific middleware
app.use("/admin", (req, res, next) => {
  console.log("Admin Section");
  next();
});

// Route handler
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route handler with specific middleware
app.get("/admin", (req, res) => {
  res.send("Admin Dashboard");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

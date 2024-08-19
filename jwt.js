const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());

const secretKey = process.env.secretKey;
const expiresIn = process.env.expiresIn;

// database
const users = [];

app.get("/users", (req, res) => {
  res.send(users);
});

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: req.body.email,
      password: hashedPassword,
    };

    // Check if user already exists
    if (users.some((u) => u.email === req.body.email)) {
      return res.status(400).json({ message: "User already registered" });
    }

    users.push(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// @desc Login Create Token
// @Route POST /login
// @Access [user, admin, manger]
app.post("/login", async (req, res) => {
  const { password, email } = req.body;

  // Find user by email
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({
      status: "Error",
      message: "User not found, please sign up",
    });
  }

  try {
    // Check if the password matches the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Error",
        message: "Incorrect password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secretKey,
      { expiresIn }
    );

    res.status(201).json({ message: "Login successful", token, data: user });
  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
});

// @desc addCart Verify Token
// @Route POST /addCart
// @Access user
app.route("/addCart").post((req, res) => {
  // 1) get token
  const { token } = req.body;

  // 2) Verify token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      throw res.status(401).json({
        status: "Error",
        message: err.message,
        expiredAt: err.expiredAt,
      });
    }

    res.status(200).json({ message: "success", token, data: decoded });
  });
});

app.listen(3000);

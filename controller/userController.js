const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

exports.registerUser = async (req, res) => {
  try {
    const { name, age, email, password, hobbies, address } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // ? Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      email,
      password: hashedPassword,
      hobbies,
      address,
    });

    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
};

const secretKey = process.env.JWT_SECRET || "ahmad";

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password.");
    }

    const token = jwt.sign({ id: user._id }, secretKey, {
      expiresIn: process.env.expiresIn,
    });

    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
};

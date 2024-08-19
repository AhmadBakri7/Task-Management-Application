const mongoose = require("mongoose");
const express = require("express");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/bookstore");

// Address schema
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  age: {
    type: Number,
    min: 1,
    max: 100,
    validate: {
      validator: (v) => v % 2 === 0,
      message: (props) => `${props.value} is not an even number`,
    },
  },
  email: {
    type: String,
    minLength: 10,
    required: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  bestFriend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hobbies: [String],
  address: addressSchema,
});

// Export the User model
const User = mongoose.model("User", userSchema);

// Function to run the app
// async function run() {
//   try {
//     const user = await User.create({
//       name: "omar",
//       age: 24,
//       email: "omar@gmail.com",
//       hobbies: ["Swimming", "Football"],
//       address: {
//         street: "Second Street",
//       },
//     });
//     console.log(user);
//   } catch (e) {
//     console.log(e.message);
//   }
// }

// run();

// Get all users

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get a user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // ! return updated one
      runValidators: true, // ! to guarantee that make the validation required
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Simple queries
app.get("/users/hobby/:hobby", async (req, res) => {
  try {
    const users = await User.find({ hobbies: req.params.hobby });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/users/age/:age", async (req, res) => {
  try {
    const users = await User.find({ age: { $gt: req.params.age } });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

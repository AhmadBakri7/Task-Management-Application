// routes/userRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");
const { validateRequest } = require("../validation/userSchemas");
const { registerSchema, loginSchema } = require("../validation/userSchemas");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

module.exports = router;

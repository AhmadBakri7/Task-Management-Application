const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

const secretKey = process.env.JWT_SECRET || "ahmad";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = {
  authenticateToken,
};

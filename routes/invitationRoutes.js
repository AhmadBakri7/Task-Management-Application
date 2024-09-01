const express = require("express");
const { authenticateToken } = require("../validation/authMiddleware");
const {
  sendInvitation,
  acceptInvitation,
} = require("../controller/inviteController");

const router = express.Router();

router.post("/", authenticateToken, sendInvitation);
router.post("/accept", acceptInvitation);

module.exports = router;

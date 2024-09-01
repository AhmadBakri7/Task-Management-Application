const { Task } = require("../models/Task");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { Invitation } = require("../models/Invitation");
const { User } = require("../models/User");

const sendInvitation = async (req, res) => {
  const { taskId, email } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    // ? Only the task owner can invite others
    if (task.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .send("You are not allowed to invite others to this task");
    }

    // ? Check if the email belongs to a registered user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User with this email is not registered");
    }

    // ? Generate a unique token for the invitation
    const token = generateToken();

    // ? Save the invitation details in the database
    const newInvitation = new Invitation({
      email,
      token,
      taskId: task._id,
      createdAt: Date.now(),
    });

    await newInvitation.save();

    // ? Add the email to the invitedUsers list
    task.invitedUsers.push(email);
    await task.save();

    // ? Send the invitation email
    await sendEmail(
      email,
      "Task Invitation",
      `You have been invited to view and comment on the task: ${task.title}, \n the token: ${token}`
    );

    res.status(200).send("Invitation sent successfully");
  } catch (error) {
    res.status(500).send("Error sending invitation");
  }
};

const acceptInvitation = async (req, res) => {
  const { token } = req.body;

  try {
    // ? Find the invitation by token
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      return res.status(400).send("Invalid or expired invitation token");
    }

    // ? Check if the token is within the 2-hour window
    const currentTime = Date.now();
    const tokenAge = currentTime - invitation.createdAt;
    const twoHoursInMillis = 2 * 60 * 60 * 1000;

    if (tokenAge > twoHoursInMillis) {
      return res.status(400).send("The invitation token has expired.");
    }

    // ? Check if the email is already in the invitedUsers list (optional check)
    const task = await Task.findById(invitation.taskId);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (!task.invitedUsers.includes(invitation.email)) {
      return res.status(403).send("This email is not invited to this task");
    }

    // ? Optionally delete the invitation after it's accepted
    await Invitation.findByIdAndDelete(invitation._id);

    res.status(200).send("Invitation accepted successfully");
    // ! push the email after acceptance (remember)
  } catch (error) {
    res.status(500).send("Error processing invitation");
  }
};

function generateToken() {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < 9; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length); // ? Get a random index from (0 to 62)
    token += characters[randomIndex];
  }

  return token;
}

module.exports = {
  sendInvitation,
  acceptInvitation,
};

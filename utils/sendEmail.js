const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rbakri9@gmail.com",
        pass: "App Password",
      },
    });

    // Define email options
    const mailOptions = {
      from: "rbakri9@gmail.com",
      to,
      subject,
      text,
    };

    // ? Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;

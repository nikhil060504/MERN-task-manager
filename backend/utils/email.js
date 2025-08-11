const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Use the provided recipient email address
  const recipient = to;

  console.log(
    `📧 Attempting to send email to ${recipient} with subject: ${subject}`
  );
  console.log(`📧 Using email credentials: ${process.env.EMAIL_USER}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email credentials are missing in environment variables");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debug output
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient, // Use the actual recipient
    subject,
    text,
  };

  try {
    console.log("📧 Mail options:", JSON.stringify(mailOptions, null, 2));
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipient}`);
    console.log(`✅ Message ID: ${info.messageId}`);
    console.log(`✅ Response: ${JSON.stringify(info.response)}`);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err);
    if (err.code === "EAUTH") {
      console.error("❌ Authentication failed. Check your email credentials.");
    } else if (err.code === "ESOCKET") {
      console.error("❌ Socket error. Check your network connection.");
    } else if (err.code === "ETIMEDOUT") {
      console.error("❌ Connection timed out. Check your network connection.");
    }
    return false;
  }
};

module.exports = sendEmail;

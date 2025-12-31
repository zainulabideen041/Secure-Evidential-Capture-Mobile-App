const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, messageType, code) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
      <div style="background-color: #004aad; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
        <h2>${
          messageType === "reset" ? "Reset Your Password" : "Verify Your Email"
        }</h2>
      </div>
      <div style="padding: 20px; background-color: white; border-radius: 0 0 10px 10px;">
        <p>Hello,</p>
        <p>
          ${
            messageType === "reset"
              ? "You requested to reset your password. Use the code below to continue:"
              : "Thank you for registering. Use the code below to verify your email:"
          }
        </p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background-color: #f1f1f1; margin: 20px 0; border-radius: 6px;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <br/>
        <p style="color: #666;">— Storink Team</p>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Storink" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: `Your ${
      messageType === "reset" ? "password reset" : "verification"
    } code is: ${code}`,
    html: htmlContent,
  });
};

module.exports = sendEmail;

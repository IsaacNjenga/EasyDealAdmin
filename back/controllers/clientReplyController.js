import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";

dotenv.config();

const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;
const otpStorage = new Map();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: user, pass: password },
  tls: { rejectUnauthorized: false },
});

const replyToEmail = async (req, res) => {
  const { to, message, name } = req.body;

  try {
    const mailOptions = {
      from: user,
      to,
      subject: `Response from Sekani Properties`,
      text: `Hi ${name},\n\n${message}\n\nBest regards,\nThe Sekani Properties Team`,
      html: `
    <div style="
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f9fafb;
      padding: 30px 0;
      color: #333;
      text-align: center;
    ">
      <div style="
        background-color: #ffffff;
        width: 90%;
        max-width: 600px;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        padding: 30px;
      ">
        <h2 style="color: #1d4ed8; margin-bottom: 10px;">Hello ${name},</h2>
        <p style="font-size: 16px; line-height: 1.7; text-align: left;">
          ${message}
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #555; text-align: left;">
          Best regards,<br/>
          <strong>Sekani Properties Team.</strong><br/><br/>
          <a href="https://sekani-properties.vercel.app" 
             style="color: #1d4ed8; text-decoration: none;">
            Visit our website
          </a>
        </p>
      </div>
      <footer style="margin-top: 20px; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} Sekani Properties. All rights reserved.
      </footer>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in sending email reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const otpRequest = async (req, res) => {
  const { to } = req.body;
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: true,
    specialChars: false,
  });
  const expiresAt = Date.now() + 2 * 60 * 1000;
  otpStorage.set(to, { otp, expiresAt });

  try {
    const mailOptions = {
      from: user,
      to,
      subject: "Your OTP Code",
      text: `Your One-Time Password is: ${otp}. It expires in 2 minutes.`,
      html: ` <div
      style="
        font-family: Arial, sans-serif;
        line-height: 1.6;
        justify-content: center;
        text-align: center;
      "
    >
      <h2 style="color: #333">Your One-Time Password</h2>
      <p>Hi there,</p>
      <p>Your OTP is:</p>
      <div
        style="
          font-size: 24px;
          font-weight: bold;
          background-color: #f2f2f2;
          padding: 10px;
          display: inline-block;
          border-radius: 5px;
        "
      >
        ${otp}
      </div>
      <p style="margin-top: 10px">
        This code will expire in <strong>2 minutes</strong>.
      </p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <small style="color: #999"
        >This is an automated message, please do not reply.</small
      >
    </div>`,
    };
    const otpInfo = await transporter.sendMail(mailOptions);
    console.log("OTP sent: " + otpInfo.response);
    res.status(201).json({ success: true, message: "OTP sent!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Could not send email" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const value = otpStorage.get(email);
  if (!value) {
    console.error("No value found for the provided email:", email);
    return;
  }
  const storedOtpData = value.otp;
  if (!storedOtpData) {
    return res.status(400).json({ error: "OTP not found or expired" });
  }
  if (storedOtpData !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if (Date.now() > value.expiresAt) {
    otpStorage.delete(email);
    return res.status(400).json({ error: "OTP Expired" });
  }

  //OTP is valid, delete it from storage
  otpStorage.delete(email);

  res.status(200).json({ success: true, message: "OTP verified" });
};

export { replyToEmail, verifyOtp, otpRequest };

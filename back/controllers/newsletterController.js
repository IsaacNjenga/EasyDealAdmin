import NewsletterModel from "../models/Newsletter.js";
import nodemailer from "nodemailer";
import juice from "juice";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

const newsletterCSS = ` .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }
      .product-card {
        background: #fff;
        border: 1px solid #eee;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      img {
        width: 180px;
        height: 180px;
        object-fit: cover;
        display:block;
        margin:auto;
      }
      .product-info {
        padding: 10px 12px;
      }
      .product-info h3 {
        font-size: 16px;
        margin: 6px 0;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .product-info p {
        font-size: 14px;
        font-weight: bold;
        color: #000;
        margin: 0 0 10px 0;
      }
      .product-info a {
        display: inline-block;
        padding: 8px 14px;
        background-color: #007BFF;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        font-size: 13px;
        font-family: Arial, sans-serif;
        font-weight: bold;
        transition: background-color 0.3s ease-in-out;
      }
      .product-info a:hover {
        background-color: #0056b3;
      }`;

const draftNewsletter = async (req, res) => {
  try {
    const { content } = req.body;
    const saved = await Newsletter.create({ content });
    res.status(201).json({ success: true, newsletter: saved });
  } catch (error) {
    console.error("Error in creating a draft newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchNewsletter = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({ message: "ID not specified" });
  }
  try {
    const newsletter = await NewsletterModel.findById(id);
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.status(200).json({ success: true, newsletter: newsletter });
  } catch (error) {
    console.error("Error in fetching this newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendNewsletter = async (req, res) => {
  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res
        .status(400)
        .json({ success: false, message: "Missing content" });
    }

    const inlinedHTML = juice.inlineContent(htmlContent, newsletterCSS);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: user, pass: password },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: user,
      to: "njengaisaac789@gmail.com",
      subject: "TODO:subject",
      html: inlinedHTML,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in sending this newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { draftNewsletter, fetchNewsletter, sendNewsletter };

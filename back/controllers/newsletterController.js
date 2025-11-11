import nodemailer from "nodemailer";
import juice from "juice";
import dotenv from "dotenv";
import { generateNewsletterHTML } from "../utils/generateHTML.js";

dotenv.config();

const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

const newsletterCSS = `

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        /* Header */
        .header {
            background-color: #000000;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .company-name {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2.4px;
            font-family: 'Bebas Neue', Arial, sans-serif;
        }
        
        .shop-btn {
            background-color: #ffa34a;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(254, 165, 73, 0.4);
            display: inline-block;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #fea549, #ffcc80);
            padding: 40px 20px;
            text-align: center;
        }
        
        .hero h1 {
            color: #000000;
            font-size: 32px;
            margin: 0 0 10px 0;
            font-weight: 700;
        }
        
        .hero p {
            color: #ffffff;
            font-size: 16px;
            margin: 0;
        }
        
        /* Products Section */
        .products-section {
            background: linear-gradient(135deg, #fea549, #ffcc80);
            padding: 0 20px 40px 20px;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
        }
        
        .product-card {
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
        }
        
        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        
        .product-content {
            padding: 24px;
            text-align: center;
        }
        
        .product-name {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 10px 0;
            color: #1e293b;
        }
        
        .product-price {
            font-weight: 700;
            font-size: 16px;
            color: #0ea5a4;
            margin: 0 0 15px 0;
        }
        
        .view-product-btn {
            display: inline-block;
            background: linear-gradient(135deg, #0ea5a4, #0c8988);
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(14, 165, 164, 0.3);
            transition: transform 0.2s ease;
        }
        
        .view-product-btn:hover {
            transform: scale(1.05);
        }
        
        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #fea549, #ffcc80);
            padding: 0 20px 40px 20px;
            text-align: center;
        }
        
        .cta-btn {
            display: inline-block;
            background: #000000;
            color: #ffffff;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        
        .cta-btn:hover {
            transform: scale(1.05);
        }
        
        /* Footer */
        .footer {
            background-color: #000000;
            padding: 30px 20px;
        }
        
        .footer-top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .footer-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .footer-company-name {
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2.4px;
            font-family: 'Bebas Neue', Arial, sans-serif;
        }
        
        .footer-right {
            text-align: right;
        }
        
        .footer-title {
            color: #fea549;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2.5px;
            margin: 0 0 10px 0;
            font-family: 'Bebas Neue', Arial, sans-serif;
        }
        
        .footer-text {
            color: #ffffff;
            font-size: 14px;
            margin: 5px 0;
        }
        
        .divider {
            border: none;
            border-top: 1px solid #444;
            margin: 20px 0;
        }
        
        .contact-info {
            color: #ffffff;
            font-size: 14px;
        }
        
        .contact-info p {
            margin: 5px 0;
        }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .header-left {
                flex-direction: column;
            }
            
            .company-name {
                font-size: 20px;
            }
            
            .logo {
                width: 60px;
                height: 60px;
            }
            
            .hero h1 {
                font-size: 24px;
            }
            
            .hero p {
                font-size: 14px;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .product-image {
                height: 180px;
            }
            
            .product-name {
                font-size: 18px;
            }
            
            .footer-top {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }
            
            .footer-left {
                flex-direction: column;
                justify-content: center;
            }
            
            .footer-right {
                text-align: center;
            }
            
            .shop-btn, .cta-btn {
                padding: 10px 20px;
                font-size: 14px;
            }
        }`;

const sendNewsletter = async (req, res) => {
  try {
    const { heading, subheading, ctaText, selectedProducts, subject } =
      req.body;

    if (!heading || !subheading || !ctaText || !selectedProducts) {
      return res
        .status(400)
        .json({ success: false, message: "Missing content" });
    }

    const htmlContent = generateNewsletterHTML({
      heading,
      subheading,
      ctaText,
      selectedProducts,
    });

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
      subject: subject,
      html: inlinedHTML,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in sending this newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { sendNewsletter };

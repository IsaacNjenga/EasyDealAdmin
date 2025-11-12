import nodemailer from "nodemailer";
import juice from "juice";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

export async function sendNewsletter(req, res) {
  try {
    const { heading, subheading, ctaText, selectedProducts, subject } =
      req.body;

    const products = selectedProducts?.length
      ? selectedProducts
      : [
          {
            img: [
              "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
            ],
            name: "Ergonomic Office Chair",
            price: 10000,
          },
        ];

    // Generate product rows (2 per row for email compatibility)
    let productRows = "";
    for (let i = 0; i < products.length; i += 2) {
      const product1 = products[i];
      const product2 = products[i + 1];

      productRows += `
        <tr>
          <td style="padding: 10px;" width="50%" valign="top">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fff; border-radius: 12px; overflow: hidden;">
              <tr>
                <td>
                  <img src="${product1.img[0]}" alt="${
        product1.name
      }" width="100%" style="display: block; height: 200px; object-fit: cover;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">${
                    product1.name
                  }</h3>
                  <p style="color: #0ea5a4; font-weight: 700; font-size: 16px; margin: 0 0 12px 0;">KES ${product1.price.toLocaleString()}</p>
                  <a href="https://easy-deal-furnitures.vercel.app/shop" style="background: linear-gradient(135deg, #0ea5a4, #0c8988); background-color: #0ea5a4; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: 600;">View Product</a>
                </td>
              </tr>
            </table>
          </td>
          ${
            product2
              ? `
          <td style="padding: 10px;" width="50%" valign="top">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fff; border-radius: 12px; overflow: hidden;">
              <tr>
                <td>
                  <img src="${product2.img[0]}" alt="${
                  product2.name
                }" width="100%" style="display: block; height: 200px; object-fit: cover;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">${
                    product2.name
                  }</h3>
                  <p style="color: #0ea5a4; font-weight: 700; font-size: 16px; margin: 0 0 12px 0;">KES ${product2.price.toLocaleString()}</p>
                  <a href="https://easy-deal-furnitures.vercel.app/shop" style="background: linear-gradient(135deg, #0ea5a4, #0c8988); background-color: #0ea5a4; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: 600;">View Product</a>
                </td>
              </tr>
            </table>
          </td>
          `
              : '<td width="50%"></td>'
          }
        </tr>
      `;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-wrapper {
      background-color: #f5f5f5;
      padding: 20px 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    @media only screen and (max-width: 600px) {
      .header-table td {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding: 10px 0 !important;
      }
      .product-cell {
        display: block !important;
        width: 100% !important;
        padding: 10px 0 !important;
      }
      .company-name {
        font-size: 18px !important;
      }
      .hero h1 {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff;" class="email-container">
          
          <!-- HEADER -->
          <tr>
            <td style="background-color: #000000; padding: 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="header-table">
                <tr>
                  <td style="text-align: left; vertical-align: middle;" width="70%">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right: 10px; vertical-align: middle;">
                          <img src="https://res.cloudinary.com/dinsdfwod/image/upload/v1762518131/office-chair_rkrf3x.png" alt="EasyDeal Logo" width="80" height="80" style="border-radius: 50%; display: block;" />
                        </td>
                        <td style="vertical-align: middle;">
                          <span class="company-name" style="color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 2px; font-family: 'Bebas Neue', Arial, sans-serif;">EASYDEAL FURNITURES</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="text-align: right; vertical-align: middle;" width="30%">
                    <a href="https://easy-deal-furnitures.vercel.app/shop" style="background-color: #ffa34a; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">Shop Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td class="hero" style="background: linear-gradient(135deg, #fea549, #ffcc80); background-color: #fea549; padding: 40px 20px; text-align: center;">
              <h1 style="color: #000000; font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">${heading}</h1>
              <p style="color: #ffffff; font-size: 16px; margin: 0; line-height: 1.6;">${subheading}</p>
            </td>
          </tr>

          <!-- PRODUCTS -->
          <tr>
            <td style="background: linear-gradient(135deg, #fea549, #ffcc80); background-color: #fea549; padding: 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${productRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background: linear-gradient(135deg, #fea549, #ffcc80); background-color: #fea549; padding: 30px 20px; text-align: center;">
              <a href="https://easy-deal-furnitures.vercel.app/shop" style="background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">${ctaText} 🛒</a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <img src="https://res.cloudinary.com/dinsdfwod/image/upload/v1762518131/office-chair_rkrf3x.png" alt="EasyDeal Logo" width="60" height="60" style="border-radius: 50%; margin-bottom: 10px;" />
                    <p style="color: #ffffff; font-size: 18px; font-weight: bold; letter-spacing: 2px; margin: 0 0 20px 0; font-family: 'Bebas Neue', Arial, sans-serif;">EASYDEAL FURNITURES</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 10px;">
                    <p style="color: #fea549; font-size: 16px; font-weight: bold; letter-spacing: 2px; margin: 0 0 10px 0; font-family: 'Bebas Neue', Arial, sans-serif;">VISIT OUR SHOWROOM</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 5px 0;">Ngara Rd., Nairobi, Kenya</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 5px 0;">Mon - Sat: 8:00am - 6:00pm</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <hr style="border: none; border-top: 1px solid #444; margin: 10px 0;" />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 10px;">
                    <p style="color: #ffffff; font-size: 14px; margin: 5px 0;">Reach out to us for any questions:</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 5px 0;">+254 722 528-672</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 5px 0;">+254 720 731-982</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 5px 0;">+254 714 738-997</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <hr style="border: none; border-top: 1px solid #444; margin: 10px 0;" />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 10px;">
                    <p style="color: #ffffff; font-size: 12px; margin: 5px 0;">&copy; ${new Date().getFullYear()} EasyDeal Furnitures. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Inline CSS using juice
    const inlinedHTML = juice(htmlContent, {
      preserveImportant: true,
      preserveMediaQueries: true,
      removeStyleTags: false,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: password },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"EasyDeal Furnitures"`,
      to: "njengaisaac789@gmail.com",
      subject: subject,
      html: inlinedHTML,
    });

    res.status(200).json({
      success: true,
      message: "Newsletter sent successfully",
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send newsletter",
      error: error.message,
    });
  }
}

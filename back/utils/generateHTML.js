export function generateNewsletterHTML({
  heading,
  subheading,
  ctaText,
  selectedProducts = [],
}) {
  const products = selectedProducts.length
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

  const productCards = products
    .map(
      (d) => `
            <div class="products-section">
            <div class="products-grid">
                <!-- Product 1 -->
                <div class="product-card">
                    <img src="${d.img[0]}" alt="img" class="product-image">
                    <div class="product-content">
                        <h3 class="product-name">${d.name}</h3>
                        <p class="product-price">KES. ${d.price.toLocaleString()}</p>
                        <a href="https://easy-deal-furnitures.vercel.app/shop" class="view-product-btn">View Product</a>
                    </div>
                </div>
                
              
                </div>
            </div>
        </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasyDeal Furnitures Newsletter</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
   <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <img src="https://res.cloudinary.com/dinsdfwod/image/upload/v1762518131/office-chair_rkrf3x.png" alt="EasyDeal Logo" class="logo">
                <span class="company-name">EASYDEAL FURNITURES</span>
            </div>
            <div>
                <a href="https://easy-deal-furnitures.vercel.app/shop" class="shop-btn">Shop Now</a>
            </div>
        </div>
        
        <!-- Hero Section -->
        <div class="hero">
            <h1>${heading}</h1>
            <p>${subheading}</p>
        </div>
        
        <!-- Products Section -->
        <div>
            ${productCards}
        </div>
        
        <!-- CTA Section -->
        <div class="cta-section">
            <a href="https://easy-deal-furnitures.vercel.app/shop" class="cta-btn"> ${ctaText} 🛒</a>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-top">
                <div class="footer-left">
                    <img src="https://res.cloudinary.com/dinsdfwod/image/upload/v1762518131/office-chair_rkrf3x.png" alt="EasyDeal Logo" class="logo">
                    <span class="footer-company-name">EASYDEAL FURNITURES</span>
                </div>
                <div class="footer-right">
                    <p class="footer-title">VISIT OUR SHOWROOM</p>
                    <p class="footer-text">Ngara Rd., Nairobi, Kenya</p>
                    <p class="footer-text">Mon - Sat: 8:00am - 6:00pm</p>
                </div>
            </div>
            
            <hr class="divider">
            
            <div class="contact-info">
                <p>Reach out to us in case of any issue, assistance or questions:</p>
                <p>+254 722 528-672</p>
                <p>+254 720 731-982</p>
                <p>+254 714 738-997</p>
            </div>
        </div>
    </div>
</body>

</html>`;
}

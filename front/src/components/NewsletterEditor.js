import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import { Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "../assets/css/quill.css";
import {
  generateNewsletterFooterHTML,
  generateNewsletterHeaderHTML,
  generateProductCardHTML,
  injectedStyles,
} from "../utils/helpers";

function NewsletterEditor({
  setValue,
  value,
  quillRef,
  products,
  setHtmlContent,
}) {
  // useEffect(() => {
  //   if (!document.getElementById("ed-newsletter-styles")) {
  //     const s = document.createElement("style");
  //     s.id = "ed-newsletter-styles";
  //     s.innerHTML = injectedStyles;
  //     document.head.appendChild(s);
  //   }
  // }, []);

  async function handleInsertProduct() {
    if (!products || products.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Products",
        text: "There are no products available to insert.",
      });
      return;
    }

    const { value: productId } = await Swal.fire({
      title: "Select a Product",
      input: "select",
      inputOptions: products.reduce((acc, p) => {
        acc[p._id] = p.name;
        return acc;
      }, {}),
      inputPlaceholder: "Choose a product to insert",
      showCancelButton: true,
      confirmButtonText: "Insert",
      confirmButtonColor: "#0ea5a4",
    });

    if (!productId) return;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const root = editor.root;
    const existingGrid = root.querySelector(".ed-product-grid");
    const cardHTML = DOMPurify.sanitize(generateProductCardHTML(product));


    if (existingGrid) {
      existingGrid.insertAdjacentHTML("beforeend", cardHTML);
      const newHtml = root.innerHTML;
      editor.clipboard.dangerouslyPasteHTML(0, newHtml);
    } else {
      const gridWrapper = `<div class="ed-product-grid">${cardHTML}</div>`;
      const range = editor.getSelection(true) || { index: editor.getLength() };
      editor.clipboard.dangerouslyPasteHTML(range.index, gridWrapper);
    }

   
  }

  // Enhanced preview
  const handlePreview = () => {
   const newsletterHTML = `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasyDeal Furnitures</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #ffa34a 0%, #ffa34a 100%);            
            min-height: 100vh;
        }

        /* Header Styles */
.ed-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 24px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid #fea549;
  margin-bottom: 32px;
}

.ed-header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.ed-header-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ed-header-logo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: none;
  box-shadow: 0 4px 16px rgba(254, 165, 73, 0.4);
}

.ed-header-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #fea549, #ffcc80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.ed-header-text p {
  margin: 4px 0 0 0;
  color: #cbd5e1;
  font-size: 13px;
  letter-spacing: 0.05em;
}

.ed-header-cta {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #fea549, #ffcc80);
  color: #0f172a;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(254, 165, 73, 0.3);
}

        .ed-product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 32px;
            margin: 32px 26px;
            max-width: 1200px;
        }

        .ed-product-card {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            position: relative;
        }

        .ed-product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #0ea5a4, #fea549);
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }

        .ed-product-card:hover::before {
            transform: scaleX(1);
        }

        .ed-product-card:hover {
            transform: translateY(-1px) scale(1.0);
            box-shadow: 0 20px 60px rgba(14, 165, 164, 0.2);
        }

        .ed-product-img-wrapper {
            position: relative;
            overflow: hidden;
            height: 300px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef); position: relative;
  overflow: hidden;
  height: 220px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
        }

        .ed-product-img {  height: 100%;
    width: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s ease;
        }

        .ed-product-card:hover .ed-product-img {
            transform: scale(1.1);
        }

        .ed-product-info {
            padding: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 12px;
        }

        .ed-product-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            color: #1e293b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: -0.02em;
        }

        .ed-product-price {
            font-weight: 700;
            font-size: 24px;
            background: linear-gradient(135deg, #0ea5a4, #0c8988);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 8px 0 16px 0;
        }

        .ed-product-cta {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #0ea5a4, #0c8988);
            color: #fff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(14, 165, 164, 0.3);
            position: relative;
            overflow: hidden;
        }

        .ed-product-cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }

        .ed-product-cta:hover::before {
            left: 100%;
        }

        .ed-product-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(14, 165, 164, 0.4);
        }

        /* Footer */
        .ed-newsletter-footer {
            background: linear-gradient(135deg, #0f172a 0%, #090e15 100%);
            color: #fff;
            padding: 48px 40px;
            margin: 48px auto 0;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }

        .ed-newsletter-footer::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(254, 165, 73, 0.1) 0%, transparent 70%);
            pointer-events: none;
        }

        .ed-footer-top {
            display: flex;
            gap: 32px;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            position: relative;
            z-index: 1;
        }

        .ed-footer-brand {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .ed-footer-logo {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 50%;
            border: none;
            box-shadow: 0 8px 24px rgba(254, 165, 73, 0.3);
            transition: transform 0.3s ease;
        }

        .ed-footer-logo:hover {
            transform: rotate(360deg) scale(1.1);
        }

        .ed-footer-brand-title {
            margin: 0;
            background: linear-gradient(135deg, #fea549, #ffcc80);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .ed-footer-showroom {
            text-align: right;
        }

        .ed-footer-showroom h3 {
            margin: 0 0 12px 0;
            color: #fea549;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        .ed-footer-showroom p {
            margin: 6px 0;
            color: #cbd5e1;
            font-size: 15px;
        }

        .ed-footer-divider {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            margin: 32px 0;
        }

        .ed-footer-bottom {
            display: flex;
            gap: 40px;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            position: relative;
            z-index: 1;
        }

        .ed-footer-social h3,
        .ed-footer-contact p {
            margin: 0 0 16px 0;
            color: #fea549;
            font-size: 16px;
            font-weight: 700;
        }

        .ed-footer-contact ul {
            list-style: none;
            color: #cbd5e1;
        }

        .ed-footer-contact li {
            margin: 8px 0;
            font-size: 15px;
        }

        .ed-social-icons {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .ed-social-icons a {
            transition: transform 0.3s ease;
            display: block;
        }

        .ed-social-icons a:hover {
            transform: translateY(-4px);
        }

        .ed-social-icons img {
            width: 40px;
            height: 40px;
            object-fit: contain;
            border-radius: 10px;
            background: linear-gradient(135deg, #fea549, #ffcc80);
            padding: 8px;
            box-shadow: 0 4px 12px rgba(254, 165, 73, 0.3);
            transition: all 0.3s ease;
        }

        .ed-social-icons a:hover img {
            box-shadow: 0 6px 20px rgba(254, 165, 73, 0.5);
            transform: scale(1.1);
        }

        @media(max-width: 720px) {
            body { padding: 20px 12px; }
            .ed-product-grid { gap: 20px; }
            .ed-product-img-wrapper { height: 180px; }
            .ed-newsletter-footer { padding: 32px 24px; }
            .ed-footer-top {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .ed-footer-showroom { text-align: center; }
            .ed-footer-bottom {
                flex-direction: column;
                gap: 24px;
                text-align: center;
            }
            .ed-social-icons { justify-content: center; }
        }
    </style>
</head>
<body>
      <header class="ed-header">
    <div class="ed-header-content">
      <div class="ed-header-brand">
        <img src="https://res.cloudinary.com/dinsdfwod/image/upload/v1762518131/office-chair_rkrf3x.png" alt="EasyDeal Logo" class="ed-header-logo"/>
        <div class="ed-header-text">
          <h1>EasyDeal Furnitures</h1>
          <p>QUALITY FURNITURE FOR YOUR SPACE</p>
        </div>
      </div>
      <a class="ed-header-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">Shop Now</a>
    </div>
  </header>

    <div class="ed-product-grid">
        <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>

       

        <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>

         <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>


         <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>


         <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>


         <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>

         <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>

         <div class="ed-product-card">
            <div class="ed-product-img-wrapper">
                <img src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" alt="Ergonomic Chair" class="ed-product-img" />
            </div>
            <div class="ed-product-info">
                <h3 class="ed-product-title">Ergonomic Chair</h3>
                <p class="ed-product-price">KES 20,000</p>
                <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
            </div>
        </div>

    </div>

    <footer class="ed-newsletter-footer">
        <div class="ed-footer-top">
            <div class="ed-footer-brand">
                <img src="https://res.cloudinary.com/dinsdfwod/image/upload/v1762518131/office-chair_rkrf3x.png" alt="EasyDeal" class="ed-footer-logo"/>
                <h2 class="ed-footer-brand-title">EasyDeal Furnitures</h2>
            </div>
            <div class="ed-footer-showroom">
                <h3>VISIT OUR SHOWROOM</h3>
                <p>Ngara Rd., Nairobi, Kenya</p>
                <p>Mon - Sat: 8:00am - 6:00pm</p>
            </div>
        </div>
        <hr class="ed-footer-divider"/>
        <div class="ed-footer-bottom">
            <div class="ed-footer-social">
                <h3>Follow us</h3>
                <div class="ed-social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"/>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram"/>
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter"/>
                    </a>
                </div>
            </div>
            <div class="ed-footer-contact">
                <p>Reach out for assistance:</p>
                <ul>
                    <li>+254 722 528-672</li>
                    <li>+254 720 731-982</li>
                    <li>+254 714 738-997</li>
                </ul>
            </div>
        </div>
    </footer>
</body>
</html>
  `;

  const blob = new Blob([newsletterHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  Swal.fire({
    title: 'Newsletter Preview',
    html: `
      <iframe src="${url}" style="width:100%;height:80vh;border:none;border-radius:12px;"></iframe>
    `,
    width: '90%',
    padding: '0',
    showCloseButton: true,
    showConfirmButton: false,
    background: 'transparent',
  });
  };

  // Quill toolbar configuration
  const modules = {
    toolbar: {
      container: "#custom-toolbar",
      handlers: {
        insertProduct: handleInsertProduct,
        previewNewsletter: handlePreview,
      },
    },
  };

  return (
    <div
      style={{ background: "#f9fafb", padding: "20px", borderRadius: "12px" }}
    >
      <div
        id="custom-toolbar"
        style={{
          marginBottom: 12,
          background: "white",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Text Formatting */}
        <select className="ql-header" defaultValue="">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="">Normal</option>
        </select>

        <button className="ql-bold" title="Bold" />
        <button className="ql-italic" title="Italic" />
        <button className="ql-underline" title="Underline" />

        <button className="ql-list" value="ordered" title="Numbered List" />
        <button className="ql-list" value="bullet" title="Bullet List" />

        <button className="ql-align" value="" title="Align Left" />
        <button className="ql-align" value="center" title="Align Center" />
        <button className="ql-align" value="right" title="Align Right" />

        <button className="ql-clean" title="Clear Formatting" />

        {/* Custom Buttons */}
        <span
          style={{
            borderLeft: "1px solid #ccc",
            margin: "0 8px",
            height: "20px",
            display: "inline-block",
          }}
        ></span>

        <Tooltip title="Insert product card" placement="bottom">
          <button
            className="ql-insertProduct"
            type="button"
            aria-label="Insert product"
            style={{ marginLeft: 6 }}
          >
            <ShoppingCartOutlined style={{ fontSize: "14px" }} />
          </button>
        </Tooltip>

        <Tooltip title="Preview newsletter" placement="bottom">
          <button
            className="ql-previewNewsletter"
            type="button"
            aria-label="Preview newsletter"
            style={{
              marginLeft: 6,
              color: "#0ea5a4",
            }}
          >
            <EyeOutlined style={{ fontSize: "16px" }} />
          </button>
        </Tooltip>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={(content, delta, source, editor) => {
          setValue(content);
          const html = editor?.root?.innerHTML ?? content;
          setHtmlContent(DOMPurify.sanitize(html));
        }}
        modules={modules}
        placeholder="Start writing your newsletter here..."
        style={{
          height: "65vh",
          background: "white",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />
    </div>
  );
}

export default NewsletterEditor;

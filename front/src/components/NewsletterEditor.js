import React, { useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import { Tooltip } from "antd";
import { EyeOutlined, FolderAddFilled, ShoppingCartOutlined } from "@ant-design/icons";

// ------------------------------
// Templates
// ------------------------------
export const generateProductCardHTML = (product) => `
  <div class="ed-product-card">
    <img src="${product.img?.[0] ?? ""}" alt="${product.name}" class="ed-product-img" />
    <div class="ed-product-info">
      <h3 class="ed-product-title">${product.name}</h3>
      <p class="ed-product-price">KES ${product.price?.toLocaleString() ?? ""}</p>
      <a class="ed-product-cta" href="https://easy-deal-furnitures.vercel.app/shop" target="_blank" rel="noopener">View Product</a>
    </div>
  </div>
`;

/* Footer kept separate so you can insert or preview-with-footer */
export const generateNewsletterFooterHTML = () => `
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
          <a href="https://facebook.com" target="_blank" rel="noopener"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="fb"/></a>
          <a href="https://instagram.com" target="_blank" rel="noopener"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="ig"/></a>
          <a href="https://x.com" target="_blank" rel="noopener"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="tw"/></a>
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
`;

// ------------------------------
// Scoped CSS (injected into HEAD)
// ------------------------------
const injectedStyles = `
/* Scoped newsletter styles (use ed- prefix to avoid collisions) */

.ed-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
  gap: 16px;
  margin: 16px 0;
}

.ed-product-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  transition: transform .18s ease, box-shadow .18s ease;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.ed-product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }

.ed-product-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.ed-product-info { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }

.ed-product-title { font-size: 16px; margin: 6px 0; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ed-product-price { font-weight: 700; color: #0ea5a4; margin: 6px 0 12px 0; }
.ed-product-cta { display:inline-block; padding:8px 12px; background:#0ea5a4; color:#fff; text-decoration:none; border-radius:6px; font-weight:600; }

/* Footer (scoped) */
.ed-newsletter-footer { background: #0f172a; color: #fff; padding: 28px; border-radius: 8px; margin-top: 24px; }
.ed-footer-top { display:flex; gap:20px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
.ed-footer-brand { display:flex; align-items:center; gap:12px; }
.ed-footer-logo { width:56px; height:56px; object-fit:cover; border-radius:50%; }
.ed-footer-brand-title { margin:0; color:#fea549; font-size:20px; }

.ed-footer-showroom h3 { margin:0 0 6px 0; color:#fea549; }
.ed-footer-divider { border:none; height:1px; background:rgba(255,255,255,0.08); margin:18px 0; }
.ed-footer-bottom { display:flex; gap:18px; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; }
.ed-footer-social h3, .ed-footer-contact p { margin:0 0 8px 0; color:#e2e8f0; }
.ed-social-icons { display:flex; gap:10px; align-items:center; }
.ed-social-icons img { width:32px; height:32px; object-fit:contain; border-radius:6px; background:#fea549; padding:6px; }

/* small screens */
@media(max-width:720px){
  .ed-product-img { height: 140px; }
  .ed-footer-top { flex-direction:column; align-items:center; text-align:center; }
  .ed-footer-bottom { flex-direction:column; gap:12px; }
}
`;

// ------------------------------
// Component
// ------------------------------
function NewsletterEditor({
  setValue,
  value,
  quillRef,
  products,
  setHtmlContent,
}) {
  // inject styles once
  useEffect(() => {
    if (!document.getElementById("ed-newsletter-styles")) {
      const s = document.createElement("style");
      s.id = "ed-newsletter-styles";
      s.innerHTML = injectedStyles;
      document.head.appendChild(s);
    }
    return () => {
      // keep styles while component mounts; optional: remove when unmounting
    };
  }, []);

  // Insert product into an existing .ed-product-grid if present,
  // otherwise create a new grid container and insert the card inside it.
  async function handleInsertProduct() {
    if (!products || products.length === 0) {
      Swal.fire("No Products", "There are no products available to insert.", "info");
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
    });

    if (!productId) return;

    const product = products.find((p) => p._id === productId);
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    // Try to locate an existing grid in the editor DOM
    const root = editor.root;
    const existingGrid = root.querySelector(".ed-product-grid");

    const cardHTML = DOMPurify.sanitize(generateProductCardHTML(product));

    if (existingGrid) {
      // append inside the existing grid
      // insert after the last child of that grid
      existingGrid.insertAdjacentHTML("beforeend", cardHTML);
      // update quill contents with DOM's modified HTML
      const newHtml = root.innerHTML;
      editor.setContents([]); // clear then set to newHtml safely
      editor.clipboard.dangerouslyPasteHTML(0, newHtml);
    } else {
      // create a new grid container and insert at current selection
      const gridWrapper = `<div class="ed-product-grid">${cardHTML}</div>`;
      const range = editor.getSelection(true) || { index: editor.getLength() };
      editor.clipboard.dangerouslyPasteHTML(range.index, gridWrapper);
    }
  }

  // Insert footer explicitly into editor (if you want to keep it permanent)
  const handleInsertFooter = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const root = editor.root;
    if (root.querySelector(".ed-newsletter-footer")) {
      Swal.fire("Footer present", "The footer is already in the document.", "info");
      return;
    }
    const footerHTML = DOMPurify.sanitize(generateNewsletterFooterHTML());
    // append at the end
    editor.clipboard.dangerouslyPasteHTML(editor.getLength(), footerHTML);
  };

  // Preview: sanitize editor value, ensure footer in preview HTML (but don't modify editor)
  const handlePreview = () => {
    const clean = DOMPurify.sanitize(value || "");
    if (!clean.trim()) {
      Swal.fire("Empty Newsletter", "Please add some content first!", "warning");
      return;
    }

    // add footer to preview if not already present in the content
    const finalHtml = clean.includes("ed-newsletter-footer")
      ? clean
      : clean + DOMPurify.sanitize(generateNewsletterFooterHTML());

    Swal.fire({
      title: "📧 Newsletter Preview",
      html: `
        <div style="max-height:70vh;overflow:auto;padding:16px;background:#f3f4f6;border-radius:12px;">
          <div class="ql-editor" style="max-width:900px;margin:auto;background:white;padding:24px;border-radius:8px;">
            ${finalHtml}
          </div>
        </div>
      `,
      width: "90%",
      showCancelButton: true,
      cancelButtonText: "Close",
      didOpen: () => {
        // inject the injectedStyles into the modal content as well in case some email clients override
        const modal = document.querySelector(".swal2-html-container");
        if (modal && !modal.querySelector("#ed-inline-styles")) {
          const styleEl = document.createElement("style");
          styleEl.id = "ed-inline-styles";
          styleEl.innerHTML = injectedStyles;
          modal.prepend(styleEl);
        }
      },
    });
  };

  // Quill modules — toolbar container id and handler names must match button classes ql-insertProduct, ql-previewNewsletter, ql-insertFooter
  const modules = {
    toolbar: {
      container: "#custom-toolbar",
      handlers: {
        insertProduct: handleInsertProduct,
        previewNewsletter: handlePreview,
        insertFooter: handleInsertFooter,
      },
    },
  };

  return (
    <>
      <div id="custom-toolbar" style={{ marginBottom: 8 }}>
        <select className="ql-header" defaultValue="">
          <option value="1" />
          <option value="2" />
          <option value="3" />
          <option value="" />
        </select>

        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-clean" />

        <Tooltip title="Insert product" placement="bottom">
          <button className="ql-insertProduct" type="button" aria-label="Insert product" style={{ marginLeft: 8 }}>
            <ShoppingCartOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Preview newsletter" placement="bottom">
          <button className="ql-previewNewsletter" type="button" aria-label="Preview newsletter" style={{ marginLeft: 6 }}>
            <EyeOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Insert footer (permanent)" placement="bottom">
          <button className="ql-insertFooter" type="button" aria-label="Insert footer" style={{ marginLeft: 6 }}>
            <FolderAddFilled />
          </button>
        </Tooltip>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={(content, delta, source, editor) => {
          setValue(content);
          // safe read of editor root HTML
          const html = editor?.root?.innerHTML ?? content;
          setHtmlContent(DOMPurify.sanitize(html));
        }}
        modules={modules}
        placeholder="Write your newsletter here..."
        style={{ height: "70vh", background: "white", borderRadius: 6 }}
      />
    </>
  );
}

export default NewsletterEditor;

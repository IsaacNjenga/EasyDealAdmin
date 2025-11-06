import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import { Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";

export const generateProductCardHTML = (product) => `
  <div class="product-card">
    <img 
      src="${product.img[0]}" 
      alt="${product.name}" 
    />
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>KES ${product.price.toLocaleString()}</p>
      <a 
        href="https://easy-deal-furnitures.vercel.app/shop"
        target="_blank"
        rel="noopener"
      >
        View Product
      </a>
    </div>
  </div>
`;

function NewsletterEditor({
  setValue,
  value,
  quillRef,
  products,
  setHtmlContent,
}) {
  // --- INSERT PRODUCT HANDLER ---
  async function handleInsertProduct() {
    if (!products || products.length === 0) {
      Swal.fire(
        "No Products",
        "There are no products available to insert.",
        "info"
      );
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

    if (productId) {
      const product = products.find((p) => p._id === productId);
      const cardHTML = generateProductCardHTML(product);
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      editor.clipboard.dangerouslyPasteHTML(
        range.index,
        `<div class="product-grid">${DOMPurify.sanitize(cardHTML)}</div>`
      );
    }
  }

  // --- PREVIEW HANDLER ---
  const handlePreview = () => {
    const sanitizedContent = DOMPurify.sanitize(value);
    if (!sanitizedContent.trim()) {
      Swal.fire("Empty Newsletter", "Please write something first!", "warning");
      return;
    }

    Swal.fire({
      title: "📧 Newsletter Preview",
      html: `
      <style>
        .product-grid {
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
          display: block;
          margin: auto;
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
        }
      </style>
  
      <div style="
        max-height: 70vh;
        overflow-y: auto;
        background-color: #f3f4f6;
        padding: 20px;
        border-radius: 12px;
      ">
        <div style="max-width: 900px; margin: 0 auto; background: white; padding: 15px; border-radius: 8px;">
          ${sanitizedContent}
        </div>
      </div>
    `,
      width: "90%",
      cancelButtonText: "Close",
      showCancelButton: true,
    });
  };

  // --- MODULES CONFIG ---
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
    <>
      {/* 🔧 CUSTOM TOOLBAR HTML */}
      <div id="custom-toolbar" style={{ marginBottom: "8px" }}>
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

        {/* 👇 Custom buttons */}
        <Tooltip title="Insert Product">
          <button className="ql-insertProduct">
            <ShoppingCartOutlined />
          </button>
        </Tooltip>

        <Tooltip title="View Newsletter">
          <button className="ql-previewNewsletter">
            <EyeOutlined />
          </button>
        </Tooltip>
      </div>

      {/* 🧠 Editor */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={(content, delta, source, editor) => {
          setValue(content);
          if (editor && editor.root) {
            setHtmlContent(editor.root.innerHTML);
          }
        }}
        modules={modules}
        placeholder="Write your message here..."
        style={{
          height: "70vh",
          background: "white",
          borderRadius: 6,
        }}
      />
    </>
  );
}

export default NewsletterEditor;

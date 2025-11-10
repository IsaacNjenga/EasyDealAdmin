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
    const cardHTML = generateProductCardHTML(product);

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
    const headerHTML = generateNewsletterHeaderHTML();
    const footerHTML = generateNewsletterFooterHTML();
    const sanitizedContent = DOMPurify.sanitize(value, {
      ALLOWED_ATTR: [
        "class",
        "id",
        "style",
        "href",
        "src",
        "alt",
        "title",
        "target",
        "rel",
        "img",
      ],
      ALLOWED_TAGS: false,
    });

    const extra = generateProductCardHTML(sanitizedContent);

    console.log(extra)

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

      ${injectedStyles}
    </style>
</head>
<body>
     ${headerHTML}

  ${extra}

${footerHTML}
</body>
</html>
  `;

    const blob = new Blob([newsletterHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    Swal.fire({
      title: "Newsletter Preview",
      html: `
      <iframe src="${url}" style="width:100%;height:80vh;border:none;border-radius:12px;"></iframe>
    `,
      width: "90%",
      padding: "0",
      showCloseButton: true,
      showConfirmButton: false,
      background: "transparent",
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
          setHtmlContent(html);
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

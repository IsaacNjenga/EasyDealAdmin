import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import useFetchAvailableProducts from "../hooks/fetchAvailableProducts";
// ✅ Optional: you can customize your card HTML here
const generateProductCardHTML = (product) => `
  <table width="100%" style="border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif;">
    <tr>
      <td style="padding: 15px; border: 1px solid #eee; border-radius: 6px; background-color: #fafafa;">
        <img 
          src="${product.img}" 
          alt="${product.name}" 
          style="width: 100%; max-width: 350px; height: auto; border-radius: 6px; margin-bottom: 10px;"
        />
        <h3 style="margin: 8px 0; color: #333;">${product.name}</h3>
        <p style="font-size: 15px; color: #666; margin-bottom: 6px;">
          ${product.description || ""}
        </p>
        <p style="font-size: 17px; font-weight: bold; color: #000;">
          KES ${product.price.toLocaleString()}
        </p>
        <a 
          href="${product.url}"
          style="display: inline-block; margin-top: 8px; padding: 10px 16px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 4px;"
        >
          View Product
        </a>
      </td>
    </tr>
  </table>
`;

function Subscribers() {
  const [value, setValue] = useState("");
  const { products, productsLoading } = useFetchAvailableProducts();
  const quillRef = useRef(null);


  // 👇 Custom handler for inserting product
  const handleInsertProduct = async () => {
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

    if (productId) {
      const product = products.find((p) => p._id === productId);
      const cardHTML = generateProductCardHTML(product);

      // Insert at cursor position
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      editor.clipboard.dangerouslyPasteHTML(range.index, DOMPurify.sanitize(cardHTML));
    }
  };

  // ✅ Add custom button to toolbar
  const CustomButton = () => (
    <span
      onClick={handleInsertProduct}
      className="ql-insertProduct"
      style={{
        cursor: "pointer",
        fontWeight: "bold",
        padding: "2px 8px",
        borderRadius: "4px",
      }}
      title="Insert Product"
    >
      🛒
    </span>
  );

  // ✅ Attach custom button to Quill toolbar
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
        ["insertProduct"], // <- custom button placeholder
      ],
      handlers: {
        insertProduct: handleInsertProduct,
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontFamily: "DM Sans" }}>📰 Create Newsletter</h2>
      <p style={{ color: "#666" }}>Compose your newsletter below and insert product cards easily.</p>

      {/* ✅ ReactQuill with custom button */}
      <div id="toolbar">
        <CustomButton />
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="Write your message here..."
        style={{
          height: "70vh",
          background: "white",
          borderRadius: 6,
        }}
      />
    </div>
  );
}

export default Subscribers;

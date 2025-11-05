import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import useFetchAvailableProducts from "../hooks/fetchAvailableProducts";

function NewletterEditor() {
  const [value, setValue] = useState("");
  const { products, productsLoading } = useFetchAvailableProducts();

  const handleInsertProduct = async () => {
    if (productsLoading) return;
    const { value: productId } = await Swal.fire({
      title: "Select a Product",
      input: "select",
      inputOptions: products.reduce((acc, p) => {
        acc[p._id] = p.name;
        return acc;
      }, {}),
      inputPlaceholder: "Choose a product",
      showCancelButton: true,
    });

    if (productId) {
      const product = products.find((p) => p._id === productId);
      const cardHTML = generateProductCardHTML(product);
      setValue((prev) => prev + DOMPurify.sanitize(cardHTML));
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
        ["insertProduct"], // custom button
      ],
      handlers: {
        insertProduct: handleInsertProduct,
      },
    },
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="Write your newsletter..."
        style={{ height: "70vh" }}
      />
    </div>
  );
}

// Card generator (same as before)
const generateProductCardHTML = (product) => `
  <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 15px; border: 1px solid #eee; border-radius: 6px;">
        <img 
          src="${product.img}" 
          alt="${product.name}" 
          style="width: 100%; max-width: 300px; height: auto; border-radius: 6px;"
        />
        <h3 style="font-family: Arial, sans-serif; margin: 10px 0; color: #333;">
          ${product.name}
        </h3>
        <p style="font-size: 16px; color: #666;">
          ${product.description || ""}
        </p>
        <p style="font-size: 18px; font-weight: bold; color: #000;">
          KES ${product.price.toLocaleString()}
        </p>
        <a 
          href="${product.url}"
          style="display: inline-block; padding: 10px 16px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif;"
        >
          View Product
        </a>
      </td>
    </tr>
  </table>
`;

export default NewletterEditor;

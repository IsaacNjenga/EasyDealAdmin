import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";

function Subscribers() {
  const [value, setValue] = useState("");
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  const handleChange = (content) => {
    const safeHTML = DOMPurify.sanitize(content);
  };

  return (
    <div>
      Subscribers
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        placeholder="Write your message here..."
        style={{ height: "70vh" }}
      />
    </div>
  );
}

export default Subscribers;

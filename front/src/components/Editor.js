import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";

function Editor({ value = "", onChange }) {
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

  // sanitize before sending back to form
  const handleChange = (content) => {
    const safeHTML = DOMPurify.sanitize(content);
    onChange(safeHTML);
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={modules}
      placeholder="Write your message here..."
      style={{ height: "30vh" }}
    />
  );
}

export default Editor;

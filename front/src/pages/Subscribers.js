import { useState, useRef } from "react";
import useFetchAvailableProducts from "../hooks/fetchAvailableProducts";
import "../assets/css/quill.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { Button } from "antd";
import NewsletterEditor from "../components/NewsletterEditor";

function Subscribers() {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);
  const { token } = useAuth();
  const { products, productsLoading } = useFetchAvailableProducts();
  const [htmlContent, setHtmlContent] = useState("");
  const openNotification = useNotification();
  const [loading, setLoading] = useState(false);

  const sendNewsletter = async () => {
    if (!htmlContent)
      return openNotification(
        "error",
        "No content has been posted",
        "Failed to send!"
      );
    setLoading(true);

    try {
      const res = await axios.post(
        "send-newsletter",
        { htmlContent: htmlContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        console.log("Sending newsletter...");
        openNotification("success", "Newsletter sent successfully!", "Sent!");
      }
    } catch (error) {
      console.error(error);
      openNotification(
        "error",
        "Failed to send newsletter",
        "There was an error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          gap: "10px",
        }}
      >
        <Button
          onClick={sendNewsletter}
          loading={loading}
          disabled={htmlContent === "" ? true : false}
          style={{
            backgroundColor: "#28A745",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Newsletter"}
        </Button>
      </div>

      <div>
        <NewsletterEditor
          quillRef={quillRef}
          value={value}
          setValue={setValue}
          products={products}
          htmlContent={htmlContent}
          setHtmlContent={setHtmlContent}
        />
      </div>
    </div>
  );
}

export default Subscribers;

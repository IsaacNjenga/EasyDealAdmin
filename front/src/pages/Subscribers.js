import { useState, useRef } from "react";
import useFetchAvailableProducts from "../hooks/fetchAvailableProducts";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { Button, Card, Col, Form, Input, Row } from "antd";
import NewsletterEditor from "../components/NewsletterEditor";
import DOMPurify from "dompurify";
import MailPreview from "../components/MailPreview";

//import chair1 from "../assets/icons/office-chair.png";

function Subscribers() {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);
  const { token } = useAuth();
  const { products, productsLoading } = useFetchAvailableProducts();
  const [htmlContent, setHtmlContent] = useState("");
  const openNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const sendNewsletter = async () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const latestHTML = DOMPurify.sanitize(editor.root.innerHTML);
      setHtmlContent(latestHTML);
    }

    if (!htmlContent.trim()) {
      return openNotification("error", "Newsletter content is empty", "Empty!");
    }
    setLoading(true);

    try {
      const formValues = await form.validateFields();
      const values = { ...formValues, content: htmlContent };
      // console.log(values);
      const res = await axios.post("send-newsletter", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      form.resetFields();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={sendNewsletter}
            >
              <Form.Item
                label={
                  <span style={{ fontFamily: "DM Sans" }}>
                    <strong>Subject</strong>
                  </span>
                }
                name="subject"
                rules={[
                  { required: true, message: "An email subject is required" },
                ]}
              >
                <Input style={{ height: 40 }} />
              </Form.Item>
              <NewsletterEditor
                quillRef={quillRef}
                value={value}
                setValue={setValue}
                products={products}
                productsLoading={productsLoading}
                setHtmlContent={setHtmlContent}
              />
              <Form.Item style={{ textAlign: "right", marginTop: 10 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
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
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <MailPreview htmlContent={htmlContent} />
        </Col>
      </Row>
    </div>
  );
}

export default Subscribers;

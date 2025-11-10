import { useState } from "react";
import useFetchAvailableProducts from "../hooks/fetchAvailableProducts";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Spin,
  Select,
  Avatar,
} from "antd";
import MailPreview from "../components/MailPreview";

const { Title } = Typography;

function Subscribers() {
  const { token } = useAuth();
  const { products, productsLoading } = useFetchAvailableProducts();
  const openNotification = useNotification();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Live state
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const sendNewsletter = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const payload = {
        subject: values.subject,
        heading,
        subheading,
        ctaText,
        products: selectedProducts,
      };

      console.log("Newsletter data:", payload);

      // Example API call:
      // await axios.post("/send-newsletter", payload, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      openNotification("success", "Newsletter sent successfully!", "Sent!");
    } catch (err) {
      console.error(err);
      openNotification("error", "Failed to send newsletter", "Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[24, 24]}>
        {/* ===== LEFT: FORM ===== */}
        <Col span={12}>
          <Title level={4} style={{ textAlign: "center" }}>
            Edit Your Newsletter
          </Title>
          <Card>
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={sendNewsletter}
            >
              <Form.Item
                label={<strong>Email Subject</strong>}
                name="subject"
                rules={[
                  { required: true, message: "An email subject is required" },
                ]}
              >
                <Input style={{ height: 40 }} placeholder="e.g. Our New Arrivals!" />
              </Form.Item>

              <Form.Item label={<strong>Heading</strong>} name="heading">
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Discover our latest collection"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              </Form.Item>

              <Form.Item label={<strong>Sub Heading</strong>} name="subheading">
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Stylish comfort for your home"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                />
              </Form.Item>

              <Form.Item label={<strong>Call To Action</strong>} name="ctaText">
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Shop Now"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                />
              </Form.Item>

              {/* Product Selector */}
              <Form.Item label={<strong>Select Products</strong>}>
                <Select
                  labelInValue
                  showSearch
                  mode="multiple"
                  placeholder="Select products to include"
                  onChange={(values) => {
                    const selected = values.map((v) =>
                      products.find((p) => p._id === v.value)
                    );
                    setSelectedProducts(selected);
                  }}
                  notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
                  style={{ width: "100%" }}
                  optionRender={(option) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {option.data?.img?.[0] && (
                        <Avatar
                          src={option.data.img[0]}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      {option.data.name}
                    </div>
                  )}
                  options={products.map((p) => ({
                    label: p.name,
                    value: p._id,
                    data: p,
                  }))}
                />
              </Form.Item>

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
                  }}
                >
                  {loading ? "Sending..." : "Send Newsletter"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* ===== RIGHT: PREVIEW ===== */}
        <Col span={12}>
          <MailPreview
            selectedProducts={selectedProducts}
            heading={heading || "Heading here"}
            subheading={subheading || "Subheading here"}
            ctaText={ctaText || "CTA text here"}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Subscribers;

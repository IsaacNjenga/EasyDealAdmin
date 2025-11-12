import { useEffect, useState } from "react";
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
  Select,
  Avatar,
} from "antd";
import MailPreview from "../components/MailPreview";
import axios from "axios";
import { useNewsletter } from "../contexts/NewsletterContext";

const { Title } = Typography;
const { Option } = Select;

const RenderSelectedItem = (value, option) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Avatar src={option.image} alt="img" shape="square" size={32} />
    <span style={{ fontWeight: 500 }}>{option.label}</span>
  </div>
);

function Subscribers() {
  const { token } = useAuth();
  const { draft, setDraft, clearDraft } = useNewsletter();
  const { products, productsLoading } = useFetchAvailableProducts();
  const openNotification = useNotification();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Live state
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (draft) {
      // Set form fields
      form.setFieldsValue({
        subject: draft.subject,
        heading: draft.heading,
        subheading: draft.subheading,
        ctaText: draft.ctaText,
        selectedProducts: draft.selectedProducts.map((p) => p._id || p.id),
      });
    }
  }, []); // Only run once on mount

  // Update draft whenever form values change
  const handleFieldChange = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sendNewsletter = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const payload = {
        subject: values.subject,
        heading: values.heading || draft.heading,
        subheading: values.subheading || draft.subheading,
        ctaText: values.ctaText || draft.ctaText,
        selectedProducts: draft.selectedProducts,
      };

      //console.log("Newsletter data:", payload);

      const res = await axios.post("/send-newsletter", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        openNotification("success", "Newsletter sent successfully!", "Sent!");
        clearDraft();
        form.resetFields();
      }
    } catch (err) {
      console.error(err);
      openNotification("error", "Failed to send newsletter", "Error!");
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection
  const handleProductChange = (selectedIds) => {
    const selected = products.filter((p) => selectedIds.includes(p._id));
    //setSelectedProducts(selected);
    handleFieldChange("selectedProducts", selected);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[24, 24]}>
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
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Our New Arrivals!"
                  onChange={(e) => handleFieldChange("subject", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label={<strong>Heading</strong>}
                name="heading"
                rules={[
                  {
                    required: true,
                    message: "A heading is required for the email",
                  },
                ]}
              >
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Discover our latest collection"
                  value={heading}
                  onChange={(e) => handleFieldChange("heading", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label={<strong>Sub Heading</strong>}
                name="subheading"
                rules={[
                  { required: true, message: "An subheading is required" },
                ]}
              >
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Stylish comfort for your home"
                  value={subheading}
                  onChange={(e) =>
                    handleFieldChange("subheading", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item
                label={<strong>Call To Action</strong>}
                name="ctaText"
                rules={[
                  {
                    required: true,
                    message: "A call to action text is required",
                  },
                ]}
              >
                <Input
                  style={{ height: 40 }}
                  placeholder="e.g. Come shop with us!"
                  value={ctaText}
                  onChange={(e) => handleFieldChange("ctaText", e.target.value)}
                />
              </Form.Item>

              {/* Product Selector */}
              <Form.Item
                label={
                  <span>
                    <strong>Select Products</strong>
                  </span>
                }
                name="selectedProducts"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one product",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Search and select products"
                  optionFilterProp="children"
                  style={{ width: "100%", height: 60 }}
                  onChange={handleProductChange}
                  filterOption={(input, option) =>
                    option?.children?.props?.children?.[1]?.props?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  loading={productsLoading}
                  optionLabelProp="label"
                  labelRender={({ value, label, image }) =>
                    RenderSelectedItem(value, { label, image })
                  }
                >
                  {products.map((product) => (
                    <Option
                      key={product._id}
                      value={product._id}
                      label={product.name}
                      image={product.img?.[0]}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          height: 60,
                        }}
                      >
                        <Avatar
                          src={product.img?.[0]}
                          alt={product.name}
                          shape="square"
                          size={50}
                        />
                        <span>{product.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
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

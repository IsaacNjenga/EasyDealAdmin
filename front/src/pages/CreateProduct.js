import { Card, Form, Spin, Row, Col, Typography, Divider } from "antd";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import ImageSection from "../components/ImageUpload";
import ProductForm from "../components/ProductForm";

const { Text, Title } = Typography;

const PRIMARY_COLOR = "#fda648";
const BORDER_COLOR = "#ffe4c4";

const cardStyle = {
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(253, 166, 72, 0.12)",
  border: `1px solid ${BORDER_COLOR}`,
  transition: "all 0.3s ease",
  overflow: "hidden",
};

function CreateProperty() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();
  const [selectedImages, setSelectedImages] = useState([]);
  const [discountOffer, setDiscountOffer] = useState(false);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [discountEndDate, setDiscountEndDate] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const allValues = await form.validateFields();
      const values = {
        ...allValues,
        img: selectedImages,
        offerStartDate: discountOffer ? discountStartDate : null,
        offerEndDate: discountOffer ? discountEndDate : null,
      };

      //console.log(values);
      const res = await axios.post("create-product", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        openNotification(
          "success",
          "Product created successfully!",
          "Success!"
        );
        navigate("/products");
      }
    } catch (error) {
      console.error(error);
      openNotification(
        "warning",
        "An unexpected error occurred. Please try again later.",
        "Something went wrong..."
      );
    } finally {
      setLoading(false);
      form.resetFields();
      setSelectedImages([]);
    }
  };

  if (loading)
    return (
      <Spin
        fullscreen
        tip="Creating Product..."
        size="large"
        style={{ color: PRIMARY_COLOR }}
      />
    );

  return (
    <div style={{ padding: "10px", background: "#fafafa", minHeight: "100vh" }}>
      <Card style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: "#2c3e50" }}>
            <ShoppingOutlined
              style={{ color: PRIMARY_COLOR, marginRight: 12 }}
            />
            Add A New Product
          </Title>
          <Text type="secondary">
            Fill in the details below to create a new product listing.
          </Text>
        </div>

        <Divider style={{ borderColor: BORDER_COLOR }} />

        <div>
          <Row gutter={[32, 24]}>
            <Col xs={24} lg={10}>
              <ImageSection
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                openNotification={openNotification}
              />
            </Col>

            <Col xs={24} lg={14}>
              <ProductForm
                handleSubmit={handleSubmit}
                discountStartDate={discountStartDate}
                setDiscountStartDate={setDiscountStartDate}
                discountEndDate={discountEndDate}
                setDiscountEndDate={setDiscountEndDate}
                discountOffer={discountOffer}
                setDiscountOffer={setDiscountOffer}
                discountedPrice={discountedPrice}
                setDiscountedPrice={setDiscountedPrice}
                loading={loading}
                formType="create"
                form={form}
              />
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}
export default CreateProperty;

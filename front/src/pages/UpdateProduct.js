import { Button, Card, Form, Spin, Row, Col, Divider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import useFetchProduct from "../hooks/fetchProduct";
import ImageSection from "../components/ImageUpload";
import ProductForm from "../components/ProductForm";

const { Title, Text } = Typography;

const PRIMARY_COLOR = "#fda648";
const BORDER_COLOR = "#ffe4c4";

function UpdateProduct() {
  const { id } = useParams();
  const { token } = useAuth();
  const [form] = Form.useForm();
  const openNotification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [discountOffer, setDiscountOffer] = useState(false);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [discountEndDate, setDiscountEndDate] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const { productData, productDataLoading, fetchProduct } = useFetchProduct();

  useEffect(() => {
    fetchProduct(id);
    //eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (productData) {
      form.setFieldsValue({
        ...productData[0],
      });
      setSelectedImages(productData[0]?.img || []);
      setDiscountStartDate(productData[0]?.offerStartDate || null);
      setDiscountEndDate(productData[0]?.offerEndDate || null);
      if (productData[0]?.offerStartDate && productData[0]?.offerEndDate) {
        setDiscountOffer(true);
      }
      if (productData[0]?.discount && productData[0]?.discount > 0) {
        setDiscountedPrice(
          productData[0]?.price -
            (productData[0]?.price * productData[0]?.discount) / 100
        );
      }
    }
  }, [productData, form]);

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
      // console.log(values);

      const res = await axios.put(`update-product?id=${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        openNotification(
          "success",
          "Product updated successfully!",
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
    }
  };

  if (productDataLoading)
    return (
      <Spin
        fullscreen
        tip="Loading..."
        size="large"
        style={{ color: PRIMARY_COLOR }}
      />
    );

  return (
    <>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontFamily: "Raleway",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{}}>
            <Title level={3} style={{ margin: 0, color: "#2c3e50" }}>
              <ShoppingOutlined
                style={{ color: PRIMARY_COLOR, marginRight: 12 }}
              />
              Update Product
            </Title>
            <Text type="secondary">
              Fill in the details below to update your product.
            </Text>
          </div>
          <div>
            <Button
              danger
              type="primary"
              onClick={() => navigate("/products")}
              style={{ borderRadius: 8 }}
            >
              Back
            </Button>
          </div>
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
                formType="update"
                form={form}
              />
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
}

export default UpdateProduct;

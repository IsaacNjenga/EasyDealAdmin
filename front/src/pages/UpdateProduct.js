import {
  Button,
  Card,
  Form,
  Input,
  Spin,
  Row,
  Col,
  Select,
  Switch,
  Image as AntImage,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const { TextArea } = Input;
const { Option } = Select;

const inputStyle = {
  borderRadius: 8,
  height: 40,
  fontFamily: "Raleway",
};

const labelStyle = {
  fontFamily: "Raleway",
  fontWeight: "bold",
  fontSize: 15,
};

const cloudName = process.env.REACT_APP_CLOUD_NAME;
const presetKey = process.env.REACT_APP_PRESET_KEY;

const productData = [
  {
    _id: 1,
    name: "Ergonomic Office chair",
    price: 20000,
    description: "Lorem Ipsum Lorem ipsum",
    colour: ["black", "green"],
    type: "office chair",
    img: [
      "https://images.pexels.com/photos/245240/pexels-photo-245240.jpeg",
      "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
    ],
    freeShipping: true,
    discount: 5,
    available: true,
    stockCount: 12,
    material: "Solid wood frame, memory foam headboard",
    dimensions: "210cm x 160cm x 100cm",
    rating: 4.7,
    totalReviews: 126,
    shippingInformation: [
      "Ships within 1-2 business days",
      "Free shipping on all orders",
      "30-day return policy",
    ],
    careGuide:
      "Use a slightly damp, soft, lint-free cloth for regular dust removal. Always clean in the direction of the grain.",
    tags: ["bedroom", "ergonomic", "modern", "furniture"],
  },
];

const ImageSection = ({
  setSelectedImages,
  selectedImages,
  openNotification,
}) => {
  const [imageUploading, setImageUploading] = useState(false);
  const handleImageUpload = (e) => {
    setImageUploading(true);

    try {
      openNotification("warning", "Please wait", "Uploading...");

      const files = Array.from(e.target.files); // Get all selected files

      const maxSize = 10 * 1024 * 1024;

      // Check each file size
      for (let file of files) {
        if (file.size > maxSize) {
          setImageUploading(false);
          return openNotification(
            "error",
            "Please select a file less than 10MB",
            "File exceeds limit!"
          );
        }
      }

      const cloud_name = cloudName;
      const preset_key = presetKey;

      let newImageUrls = [];

      const uploadPromises = files.map((file) => {
        const formImageData = new FormData();
        formImageData.append("file", file);
        formImageData.append("upload_preset", preset_key);

        return axios
          .post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            formImageData,
            { withCredentials: false }
          )
          .then((res) => {
            // For each uploaded image, update the arrays setImageUploading(true);

            newImageUrls.push(res.data.secure_url);
          })
          .catch((error) => {
            console.log(error);
            openNotification(
              "error",
              "There was an unexpected error. Please try again",
              "Failed to upload your picture"
            );
          });
      });

      // After all uploads are done, update the state
      Promise.all(uploadPromises).then(async () => {
        setImageUploading(false);
        openNotification("success", "Image uploaded successfully", "Success!");

        setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
        //console.log(imagePublicIds[0]);
      });
    } catch (error) {
      console.log(error);
      openNotification(
        "error",
        "There was an unexpected error. Please try again",
        "Failed to upload your picture"
      );
    } finally {
      setImageUploading(false);
    }

    //e.target.value = ""; // clear input
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Form.Item
        name="img"
        label={<span style={labelStyle}>Drop your image(s) here</span>}
      >
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </Form.Item>

      <Col span={24}>
        {imageUploading && (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {selectedImages.length > 0 ? (
          <Row gutter={[24, 24]}>
            {selectedImages.map((item, index) => {
              return (
                <Col span={12} key={index}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      width: 220,
                      height: 220,
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      shape="circle"
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        background: "white",
                        border: "1px solid red",
                      }}
                      onClick={(e) => removeImage(e, index)}
                    />
                    <AntImage
                      src={item}
                      alt="uploaded_img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div style={{ padding: 20, color: "#666" }}>
            No images selected yet.
          </div>
        )}
      </Col>
    </div>
  );
};

function UpdateProduct() {
  const { id } = useParams();
  const { token } = useAuth();
  const [form] = Form.useForm();
  const openNotification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  //const { productDataLoading, fetchProperty } = useFetchProperty();

  // useEffect(() => {
  //   fetchProperty(id);
  // }, [id]);

  // useEffect(() => {
  //   if (productData[0]) {
  //     form.setFieldsValue({
  //       ...productData,
  //     });
  //     setSelectedImages(productData.img || []);
  //   }
  // }, [productData, form]);

  useEffect(() => {
    // Simulate fetching one product (like from backend)
    const product = productData.find((p) => p._id === 1); // or use your id param

    if (product) {
      // Wait a tick for the form to mount
      setTimeout(() => {
        form.setFieldsValue({
          name: product.name,
          price: product.price,
          description: product.description,
          colour: product.colour,
          type: product.type,
          freeShipping: product.freeShipping,
          discount: product.discount,
          available: product.available,
          stockCount: product.stockCount,
          material: product.material,
          dimensions: product.dimensions,
          shippingInformation: product.shippingInformation,
          careGuide: product.careGuide,
          tags: product.tags,
          category: "Living Room Furniture", // or product.category if defined
        });
        setSelectedImages(product.img || []);
      }, 0);
    }
  }, [form]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const allValues = await form.validateFields();
      const values = {
        ...allValues,
        img: selectedImages,
      };
      console.log(values);

      // const res = await axios.put(`update-product?id=${id}`, values, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (res.data.success) {
      //   openNotification(
      //     "success",
      //     "Product updated successfully!",
      //     "Success!"
      //   );
      //   navigate("/products");
      // }
    } catch (error) {
      console.error(error);
      openNotification(
        "warning",
        "An unexpected error occurred. Please try again later.",
        "Something went wrong..."
      );
    } finally {
      setLoading(false);
      //form.resetFields();
      //setSelectedImages([]);
    }
  };

  // if (productDataLoading)
  //   return <Spin fullscreen tip="Loading..." size="large" />;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          danger
          type="primary"
          onClick={() => navigate("/products")}
          style={{ marginBottom: 20, width: "20%" }}
        >
          Back
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontFamily: "Raleway",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <ImageSection
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                openNotification={openNotification}
              />
            </Col>

            {/* Other inputs */}
            <Col xs={24} md={12}>
              <div>
                <Row gutter={[24, 24]}>
                  {/* LEFT COLUMN */}
                  <Col xs={24} md={24}>
                    <Form.Item
                      name="name"
                      label={<span style={labelStyle}>Product Name</span>}
                      rules={[{ required: true }]}
                    >
                      <Input
                        style={inputStyle}
                        placeholder="E.g., 4-Drawer Cabinet"
                      />
                    </Form.Item>

                    <Form.Item
                      name="type"
                      label={<span style={labelStyle}>Product Type</span>}
                      rules={[{ required: true }]}
                    >
                      <Select style={inputStyle} placeholder="Select type">
                        <Option value="Desk">Desk</Option>
                        <Option value="Chair">Chair</Option>
                        <Option value="Bed">Bed</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    {" "}
                    <Form.Item
                      name="description"
                      label={
                        <span style={labelStyle}>Product Description</span>
                      }
                    >
                      <TextArea
                        rows={4}
                        style={{ borderRadius: 8, width: "100%" }}
                        placeholder="Say something about this product"
                      />
                    </Form.Item>
                    <Form.Item
                      name="colour"
                      label={<span style={labelStyle}>Available Colors</span>}
                      extra="Separate each entry with 'Enter'"
                    >
                      <Select
                        mode="tags"
                        placeholder="E.g. Green, Black, Yellow"
                        style={{ ...inputStyle, width: "100%" }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="price"
                      label={<span style={labelStyle}>Price</span>}
                      rules={[{ required: true }]}
                    >
                      <Input type="number" style={inputStyle} prefix="KES" />
                    </Form.Item>

                    <Form.Item
                      name="discount"
                      label={<span style={labelStyle}>Discount on item?</span>}
                      extra="Leave blank if not applicable"
                    >
                      <Input type="number" style={inputStyle} suffix="%" />
                    </Form.Item>

                    <Form.Item
                      name="stockCount"
                      label={<span style={labelStyle}>Stock Count</span>}
                    >
                      <Input type="number" style={inputStyle} />
                    </Form.Item>
                  </Col>

                  {/* RIGHT COLUMN */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="category"
                      label={<span style={labelStyle}>Category</span>}
                    >
                      <Select style={inputStyle} placeholder="Select">
                        <Option value="Living Room Furniture">
                          Living Room Furniture
                        </Option>
                        <Option value="Kitchen Furniture">
                          Kitchen Furniture
                        </Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="freeShipping"
                      label={
                        <span style={labelStyle}>
                          Free Shipping on this product?
                        </span>
                      }
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>

                    <Form.Item
                      name="available"
                      label={<span style={labelStyle}>Product Available?</span>}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* FULL WIDTH SECTION */}
                <Row gutter={[24, 24]} style={{ marginTop: 10 }}>
                  <Col span={24}>
                    {" "}
                    <Form.Item
                      name="shippingInformation"
                      label={
                        <span style={labelStyle}>Shipping Information</span>
                      }
                      extra="Separate each entry with 'Enter'"
                    >
                      <Select
                        mode="tags"
                        placeholder="E.g. Ships within 1-2 business days"
                        style={{ ...inputStyle, width: "100%", height: 65 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="careGuide"
                      label={<span style={labelStyle}>Care Instructions</span>}
                      extra="Separate each entry with 'Enter'"
                    >
                      <Select
                        mode="tags"
                        placeholder="E.g. Clean with a soft, damp cloth"
                        style={{ ...inputStyle, width: "100%", height: 65 }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="tags"
                      label={<span style={labelStyle}>Additional Tags</span>}
                      extra="Separate each entry with 'Enter'"
                    >
                      <Select
                        mode="tags"
                        placeholder="E.g. sofa, leather, modern, comfort"
                        style={{ ...inputStyle, width: "100%", height: 65 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              style={{ borderRadius: 8 }}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default UpdateProduct;

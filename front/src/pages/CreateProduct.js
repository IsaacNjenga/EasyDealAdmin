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
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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

function CreateProperty() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();
  const [selectedImages, setSelectedImages] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const allValues = await form.validateFields();
      const values = {
        ...allValues,
        //createdBy: user?._id,
        img: selectedImages,
      };
      console.log(values);

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
    return <Spin fullscreen tip="Creating Product..." size="large" />;

  return (
    <>
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
          initialValues={{
            furnished: false, // 👈 ensures the field exists from the start
          }}
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
                      rules={[
                        { required: true, message: "Product name is required" },
                      ]}
                    >
                      <Input
                        style={inputStyle}
                        placeholder="E.g., 4-Drawer Cabinet"
                      />
                    </Form.Item>

                    <Form.Item
                      name="type"
                      label={<span style={labelStyle}>Product Type</span>}
                      rules={[
                        { required: true, message: "Product type is required" },
                      ]}
                    >
                      <Select style={inputStyle} placeholder="Select type">
                        <Option value="Office Desk">Office Desk</Option>
                        <Option value="Office Chair">Office Chair</Option>
                        <Option value="Bed">Bed</Option>
                        <Option value="Sofa">Sofa</Option>
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
                      rules={[
                        {
                          required: true,
                          message: "A description is required",
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: "Product colour is required",
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: "Product price is required",
                        },
                      ]}
                    >
                      <Input type="number" style={inputStyle} prefix="KES" />
                    </Form.Item>

                    <Form.Item
                      name="discount"
                      label={<span style={labelStyle}>Discount on item?</span>}
                      extra="Leave blank if not applicable"
                    >
                      <Input type="number" style={inputStyle} suffix="%" min={0} max={99}/>
                    </Form.Item>

                    <Form.Item
                      name="stockCount"
                      label={<span style={labelStyle}>Stock Count</span>}
                      rules={[
                        {
                          required: true,
                          message: "A stock count is required",
                        },
                      ]}
                    >
                      <Input type="number" style={inputStyle} />
                    </Form.Item>
                  </Col>

                  {/* RIGHT COLUMN */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="category"
                      label={<span style={labelStyle}>Category</span>}
                      rules={[
                        {
                          required: true,
                          message: "Product category is required",
                        },
                      ]}
                    >
                      <Select style={inputStyle} placeholder="Select">
                        <Option value="Living Room Furniture">
                          Living Room Furniture
                        </Option>
                        <Option value="Kitchen Furniture">
                          Kitchen Furniture
                        </Option>
                        <Option value="Office Furniture">
                          Office Furniture
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
                      rules={[
                        {
                          required: true,
                          message: "Product availability is required",
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: "Product tags are required",
                        },
                      ]}
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
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default CreateProperty;

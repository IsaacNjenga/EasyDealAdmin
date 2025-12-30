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
  DatePicker,
  Typography,
  Tag,
  Space,
  Divider,
} from "antd";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  DeleteOutlined,
  CloudUploadOutlined,
  DollarOutlined,
  TagsOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  CalendarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { format } from "date-fns";
import useSavedOptions from "../hooks/savedOptions";

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const PRIMARY_COLOR = "#fda648";
const SECONDARY_COLOR = "#ff8c42";
const LIGHT_BG = "#fff8f0";
const BORDER_COLOR = "#ffe4c4";

const inputStyle = {
  borderRadius: 12,
  height: 44,
  fontFamily: "Raleway",
  border: `1.5px solid ${BORDER_COLOR}`,
  transition: "all 0.3s ease",
};

const labelStyle = {
  fontFamily: "Raleway",
  fontWeight: 600,
  fontSize: 14,
  color: "#2c3e50",
  marginBottom: 8,
};

const cardStyle = {
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(253, 166, 72, 0.12)",
  border: `1px solid ${BORDER_COLOR}`,
  transition: "all 0.3s ease",
  overflow: "hidden",
};

const cloudName = process.env.REACT_APP_CLOUD_NAME;
const presetKey = process.env.REACT_APP_PRESET_KEY;

const ImageSection = ({
  setSelectedImages,
  selectedImages,
  openNotification,
}) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (e) => {
    setImageUploading(true);

    try {
      openNotification("warning", "Please wait", "Uploading...");

      const files = Array.from(e.target.files);
      const maxSize = 10 * 1024 * 1024;

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

      Promise.all(uploadPromises).then(async () => {
        setImageUploading(false);
        openNotification("success", "Image uploaded successfully", "Success!");
        setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
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
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        background: LIGHT_BG,
        padding: 24,
        borderRadius: 16,
        border: `2px dashed ${dragActive ? PRIMARY_COLOR : BORDER_COLOR}`,
        transition: "all 0.3s ease",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={() => setDragActive(false)}
    >
      <Form.Item
        name="img"
        label={
          <Space>
            <CloudUploadOutlined style={{ color: PRIMARY_COLOR }} />
            <span style={labelStyle}>Product Images</span>
          </Space>
        }
      >
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            background: "white",
            borderRadius: 12,
            border: `2px dashed ${BORDER_COLOR}`,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <InboxOutlined
            style={{ fontSize: 48, color: PRIMARY_COLOR, marginBottom: 16 }}
          />
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ color: PRIMARY_COLOR }}>
              Click to upload
            </Text>{" "}
            <Text type="secondary">or drag and drop</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            PNG, JPG up to 10MB
          </Text>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>
      </Form.Item>

      <Col span={24}>
        {imageUploading && (
          <div style={{ margin: "24px auto", textAlign: "center" }}>
            <Spin size="large" />
            <div style={{ marginTop: 12, color: PRIMARY_COLOR }}>
              Uploading images...
            </div>
          </div>
        )}
        {selectedImages.length > 0 ? (
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {selectedImages.map((item, index) => {
              return (
                <Col xs={12} sm={8} md={12} lg={8} key={index}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      height: 180,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      shape="circle"
                      size="small"
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid #ff4d4f",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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
          !imageUploading && (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#999",
                background: "white",
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <InboxOutlined style={{ fontSize: 36, marginBottom: 8 }} />
              <div>No images selected yet</div>
            </div>
          )
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
  const [discountOffer, setDiscountOffer] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [discountEndDate, setDiscountEndDate] = useState(null);
  const { savedOptions: careGuide, addOptions: addCareGuide } =
    useSavedOptions("care_guide_list");
  const { savedOptions: shippingInfo, addOptions: addShippingInfo } =
    useSavedOptions("shipping_info_list");
  const { savedOptions: tags, addOptions: addTags } =
    useSavedOptions("tags_list");

  const handleSwitchChange = (value) => {
    setDiscountOffer(value);
    if (!value) {
      form.setFieldsValue({ discount: null });
      setDiscountedPrice(null);
      setDiscountStartDate(null);
      setDiscountEndDate(null);
    }
  };

  const handleNewPrice = () => {
    const discount = form.getFieldValue("discount");
    const price = form.getFieldValue("price");
    if (!price) return;
    if (discount && price) {
      const discounted = price - (price * discount) / 100;
      setDiscountedPrice(discounted);
    }
  };

  const handleDiscountDate = (date) => {
    const offerStartDate = date[0]?.format("YYYY-MM-DD");
    const offerEndDate = date[1]?.format("YYYY-MM-DD");
    setDiscountStartDate(offerStartDate);
    setDiscountEndDate(offerEndDate);
  };

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
    <div style={{ padding: "24px", background: "#fafafa", minHeight: "100vh" }}>
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

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{
            discountAvailable: false,
          }}
        >
          <Row gutter={[32, 24]}>
            <Col xs={24} lg={10}>
              <ImageSection
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                openNotification={openNotification}
              />
            </Col>

            <Col xs={24} lg={14}>
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div
                      style={{
                        background: LIGHT_BG,
                        padding: 20,
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <Space style={{ marginBottom: 16 }}>
                        <InfoCircleOutlined style={{ color: PRIMARY_COLOR }} />
                        <Text strong style={{ color: PRIMARY_COLOR }}>
                          Basic Information
                        </Text>
                      </Space>

                      <Form.Item
                        name="name"
                        label={<span style={labelStyle}>Product Name</span>}
                        rules={[
                          {
                            required: true,
                            message: "Product name is required",
                          },
                        ]}
                      >
                        <Input
                          style={inputStyle}
                          placeholder="E.g., 4-Drawer Cabinet"
                          prefix={
                            <TagsOutlined style={{ color: PRIMARY_COLOR }} />
                          }
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="type"
                            label={<span style={labelStyle}>Product Type</span>}
                            rules={[
                              {
                                required: true,
                                message: "Product type is required",
                              },
                            ]}
                          >
                            <Select
                              style={inputStyle}
                              placeholder="Select type"
                            >
                              <Option value="Office Desk">Office Desk</Option>
                              <Option value="Office Chair">Office Chair</Option>
                              <Option value="Bed">Bed</Option>
                              <Option value="Sofa">Sofa</Option>
                            </Select>
                          </Form.Item>
                        </Col>

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
                            <Select
                              style={inputStyle}
                              placeholder="Select category"
                            >
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
                        </Col>
                      </Row>

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
                          style={{
                            borderRadius: 12,
                            border: `1.5px solid ${BORDER_COLOR}`,
                          }}
                          placeholder="Describe your product in detail..."
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
                        extra="Press Enter after each color"
                      >
                        <Select
                          mode="tags"
                          placeholder="E.g. Green, Black, Yellow"
                          style={{ ...inputStyle, height: "auto" }}
                          tagRender={(props) => (
                            <Tag
                              color={PRIMARY_COLOR}
                              closable
                              onClose={props.onClose}
                              style={{
                                marginRight: 3,
                                borderRadius: 8,
                                padding: "4px 8px",
                              }}
                            >
                              {props.label}
                            </Tag>
                          )}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col span={24}>
                    <div
                      style={{
                        background: LIGHT_BG,
                        padding: 20,
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <Space style={{ marginBottom: 16 }}>
                        <DollarOutlined style={{ color: PRIMARY_COLOR }} />
                        <Text strong style={{ color: PRIMARY_COLOR }}>
                          Pricing & Stock
                        </Text>
                      </Space>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="price"
                            label={
                              <span style={labelStyle}>Selling Price</span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Product price is required",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              style={inputStyle}
                              prefix="KES"
                              placeholder="0.00"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
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
                            <Input
                              type="number"
                              style={inputStyle}
                              placeholder="0"
                              prefix={
                                <InboxOutlined
                                  style={{ color: PRIMARY_COLOR }}
                                />
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="discountAvailable"
                            label={
                              <span style={labelStyle}>
                                <GiftOutlined
                                  style={{
                                    color: PRIMARY_COLOR,
                                    marginRight: 6,
                                  }}
                                />
                                Discount Available?
                              </span>
                            }
                            valuePropName="checked"
                          >
                            <Switch
                              checkedChildren="Yes"
                              unCheckedChildren="No"
                              onChange={handleSwitchChange}
                              style={{
                                background: discountOffer
                                  ? PRIMARY_COLOR
                                  : undefined,
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {discountOffer && (
                        <div
                          style={{
                            background: "white",
                            padding: 16,
                            borderRadius: 12,
                            border: `1.5px solid ${PRIMARY_COLOR}`,
                            marginTop: 12,
                            animation: "fadeIn 0.3s ease",
                          }}
                        >
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="discount"
                                label={
                                  <span style={labelStyle}>
                                    Discount Percentage
                                  </span>
                                }
                              >
                                <Input
                                  type="number"
                                  style={inputStyle}
                                  suffix="%"
                                  min={0}
                                  max={99}
                                  onChange={handleNewPrice}
                                  placeholder="0"
                                />
                              </Form.Item>

                              {discountedPrice && (
                                <div
                                  style={{
                                    background: LIGHT_BG,
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 16,
                                  }}
                                >
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                    New Price
                                  </Text>
                                  <div>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: 20,
                                        color: PRIMARY_COLOR,
                                      }}
                                    >
                                      KES {discountedPrice.toLocaleString()}
                                    </Text>
                                  </div>
                                </div>
                              )}
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label={
                                  <span style={labelStyle}>
                                    <CalendarOutlined
                                      style={{
                                        color: PRIMARY_COLOR,
                                        marginRight: 6,
                                      }}
                                    />
                                    Offer Period
                                  </span>
                                }
                              >
                                <RangePicker
                                  onChange={handleDiscountDate}
                                  style={{
                                    width: "100%",
                                    borderRadius: 12,
                                    height: 44,
                                  }}
                                />
                              </Form.Item>

                              {discountStartDate && discountEndDate && (
                                <div
                                  style={{
                                    background: LIGHT_BG,
                                    padding: 12,
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text style={{ fontSize: 12 }}>
                                    <CheckCircleOutlined
                                      style={{
                                        color: PRIMARY_COLOR,
                                        marginRight: 6,
                                      }}
                                    />
                                    {format(
                                      new Date(discountStartDate),
                                      "dd MMM yyyy"
                                    )}{" "}
                                    →{" "}
                                    {format(
                                      new Date(discountEndDate),
                                      "dd MMM yyyy"
                                    )}
                                  </Text>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col span={24}>
                    <div
                      style={{
                        background: LIGHT_BG,
                        padding: 20,
                        borderRadius: 12,
                      }}
                    >
                      <Space style={{ marginBottom: 16 }}>
                        <CheckCircleOutlined style={{ color: PRIMARY_COLOR }} />
                        <Text strong style={{ color: PRIMARY_COLOR }}>
                          Additional Settings
                        </Text>
                      </Space>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="freeShipping"
                            label={
                              <span style={labelStyle}>Free Shipping?</span>
                            }
                            valuePropName="checked"
                          >
                            <Switch
                              checkedChildren="Yes"
                              unCheckedChildren="No"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item
                            name="available"
                            label={
                              <span style={labelStyle}>Product Available?</span>
                            }
                            valuePropName="checked"
                            rules={[
                              {
                                required: true,
                                message: "Product availability is required",
                              },
                            ]}
                          >
                            <Switch
                              checkedChildren="Yes"
                              unCheckedChildren="No"
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="shippingInformation"
                        label={
                          <span style={labelStyle}>Shipping Information</span>
                        }
                        extra="Press Enter after each entry"
                      >
                        <Select
                          mode="tags"
                          placeholder="E.g. Ships within 1-2 business days"
                          style={{ ...inputStyle, height: "auto" }}
                          size="large"
                          options={shippingInfo.map((item) => ({
                            value: item,
                            label: item,
                          }))}
                          onChange={addShippingInfo}
                          tagRender={(props) => (
                            <Tag
                              color="blue"
                              closable
                              onClose={props.onClose}
                              style={{
                                marginRight: 3,
                                borderRadius: 8,
                                padding: "4px 8px",
                              }}
                            >
                              {props.label}
                            </Tag>
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        name="careGuide"
                        label={
                          <span style={labelStyle}>Care Instructions</span>
                        }
                        extra="Press Enter after each entry"
                      >
                        <Select
                          mode="tags"
                          placeholder="E.g. Clean with a soft, damp cloth"
                          style={{ ...inputStyle, height: "auto" }}
                          size="large"
                          options={careGuide.map((item) => ({
                            value: item,
                            label: item,
                          }))}
                          onChange={addCareGuide}
                          tagRender={(props) => (
                            <Tag
                              color="green"
                              closable
                              onClose={props.onClose}
                              style={{
                                marginRight: 3,
                                borderRadius: 8,
                                padding: "4px 8px",
                              }}
                            >
                              {props.label}
                            </Tag>
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        name="tags"
                        label={<span style={labelStyle}>Product Tags</span>}
                        extra="Press Enter after each tag"
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
                          style={{ ...inputStyle, height: "auto" }}
                          size="large"
                          options={tags.map((item) => ({
                            value: item,
                            label: item,
                          }))}
                          onChange={addTags}
                          tagRender={(props) => (
                            <Tag
                              color={PRIMARY_COLOR}
                              closable
                              onClose={props.onClose}
                              style={{
                                marginRight: 3,
                                borderRadius: 8,
                                padding: "4px 8px",
                              }}
                            >
                              {props.label}
                            </Tag>
                          )}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: BORDER_COLOR, margin: "32px 0" }} />

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              icon={<CheckCircleOutlined />}
              style={{
                borderRadius: 12,
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                border: "none",
                boxShadow: `0 4px 15px rgba(253, 166, 72, 0.4)`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(253, 166, 72, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(253, 166, 72, 0.4)";
              }}
            >
              {loading ? "Creating Product..." : "Create Product"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
export default CreateProperty;

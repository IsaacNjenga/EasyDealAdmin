import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Switch,
  DatePicker,
  Typography,
  Tag,
  Space,
  Divider,
  Button,
} from "antd";
import {
  DollarOutlined,
  TagsOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import useSavedOptions from "../hooks/savedOptions";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
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

function ProductForm({
  handleSubmit,
  setDiscountStartDate,
  discountEndDate,
  setDiscountEndDate,
  discountOffer,
  setDiscountOffer,
  discountStartDate,
  loading,
  formType,
  form,
  discountedPrice,
  setDiscountedPrice,
}) {
  const { savedOptions: careGuide, addOptions: addCareGuide } =
    useSavedOptions("care_guide_list");
  const { savedOptions: shippingInfo, addOptions: addShippingInfo } =
    useSavedOptions("shipping_info_list");
  const { savedOptions: tags, addOptions: addTags } =
    useSavedOptions("tags_list");
  const { savedOptions: colours, addOptions: addColours } =
    useSavedOptions("colours_list");

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

  const getButtonText = () => {
    if (formType === "create") {
      return loading ? "Creating Product..." : "Create Product";
    }
    return loading ? "Updating Product..." : "Update Product";
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        initialValues={{
          discountAvailable: false,
        }}
      >
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
                    prefix={<TagsOutlined style={{ color: PRIMARY_COLOR }} />}
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
                      <Select style={inputStyle} placeholder="Select type">
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
                      <Select style={inputStyle} placeholder="Select category">
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
                  label={<span style={labelStyle}>Product Description</span>}
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
                    size="large"
                    options={colours.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={addColours}
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
                    Pricing Details
                  </Text>
                </Space>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="price"
                      label={<span style={labelStyle}>Selling Price</span>}
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
                          background: discountOffer ? PRIMARY_COLOR : undefined,
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
                          label={<span style={labelStyle}>Discount Offer</span>}
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
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Discounted Price
                            </Text>
                            <div>
                              <Text
                                strong
                                style={{
                                  fontSize: 16,
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
                              marginBottom: 16,
                            }}
                          >
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Duration
                            </Text>
                            <div>
                              <Text
                                strong
                                style={{
                                  fontSize: 16,
                                  color: PRIMARY_COLOR,
                                }}
                              >
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
                      label={<span style={labelStyle}>Free Shipping?</span>}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
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

                <Form.Item
                  name="shippingInformation"
                  label={<span style={labelStyle}>Shipping Information</span>}
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
                  label={<span style={labelStyle}>Care Instructions</span>}
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
        </div>{" "}
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
            {getButtonText()}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ProductForm;

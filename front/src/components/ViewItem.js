import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Carousel,
  Col,
  Modal,
  Row,
  Tooltip,
  Typography,
  Image,
  Card,
  Badge,
  Space,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import React from "react";

const { Title, Paragraph, Text } = Typography;

function ViewItem({ loading, openModal, setOpenModal, content }) {
  const navigate = useNavigate();

  const discountedPrice =
    content?.discount > 0
      ? ((100 - content?.discount) * content?.price) / 100
      : content?.price;

  return (
    <>
      <Modal
        footer={null}
        open={openModal}
        centered
        onCancel={() => setOpenModal(false)}
        confirmLoading={loading}
        width={1000}
        style={{ top: 20, bottom: 20 }}
        closeIcon={
          <CloseOutlined
            style={{
              color: "#fff",
              fontSize: 20,
              background: "rgba(0,0,0,0.5)",
              borderRadius: "50%",
              padding: 8,
            }}
          />
        }
        styles={{
          mask: { backdropFilter: "blur(2px)" },
          content: {
            background: "linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)",
            border: "none",
            borderRadius: 12,
            overflow: "hidden",
            padding: 0,
          },
        }}
      >
        <Row gutter={0} style={{ minHeight: 500 }}>
          {/* Left Side - Image Carousel */}
          <Col
            xs={24}
            sm={24}
            md={14}
            style={{
              background: "linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ width: "100%", maxWidth: 500 }}>
              <Card
                style={{
                  background: "transparent",
                  borderColor: "#8d3c3c00",
                  margin: 0,
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <Carousel autoplay autoplaySpeed={3500} dots arrows>
                  {(Array.isArray(content?.img)
                    ? content?.img
                    : [content?.img]
                  ).map((img, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <Image
                        src={img}
                        alt="img"
                        loading="lazy"
                        height={500}
                        width={500}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        preview={{
                          mask: "View Full Image",
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Card>
            </div>
          </Col>

          {/* Right Side - Product Details */}
          <Col
            xs={24}
            sm={24}
            md={10}
            style={{
              background: "#ffffff",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {/* Product Name */}
              <div>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    fontFamily: "DM Sans",
                    letterSpacing: 0.5,
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                  }}
                >
                  {content?.name}
                </Title>

                {/* Type Badge */}
                <div style={{ marginTop: 12 }}>
                  <Badge
                    count={content?.type?.toUpperCase()}
                    style={{
                      backgroundColor: "#ffa449",
                      color: "#fff",
                      fontFamily: "DM Sans",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 12px",
                      height: "auto",
                    }}
                  />
                </div>
              </div>

              {/* Price Section */}
              <Card
                style={{
                  background:
                    "linear-gradient(135deg, #ffa449 0%, #ff8c1a 100%)",
                  border: "none",
                  borderRadius: 12,
                }}
                bodyStyle={{ padding: "20px 24px" }}
              >
                <Space direction="vertical" size={4}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 14,
                      fontFamily: "DM Sans",
                      fontWeight: 500,
                    }}
                  >
                    Price
                  </Text>
                  <div>
                    {content?.discount > 0 ? (
                      <Space size={12} align="center">
                        <Title
                          level={2}
                          style={{
                            color: "#fff",
                            margin: 0,
                            fontFamily: "DM Sans",
                            fontWeight: 700,
                          }}
                        >
                          KES {discountedPrice.toLocaleString()}
                        </Title>
                        <Text
                          delete
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 18,
                            fontFamily: "DM Sans",
                          }}
                        >
                          KES {content?.price.toLocaleString()}
                        </Text>
                      </Space>
                    ) : (
                      <Title
                        level={2}
                        style={{
                          color: "#fff",
                          margin: 0,
                          fontFamily: "DM Sans",
                          fontWeight: 700,
                        }}
                      >
                        KES {content?.price.toLocaleString()}
                      </Title>
                    )}
                  </div>
                </Space>
              </Card>

              {/* Description */}
              <div>
                <Paragraph
                  style={{
                    fontFamily: "Raleway",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#555",
                    margin: 0,
                  }}
                >
                  {content?.description}
                </Paragraph>
              </div>

              {/* Colors */}
              {content?.colour?.length > 0 && (
                <div>
                  <Text
                    strong
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 14,
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: 12,
                    }}
                  >
                    Available Colors
                  </Text>
                  <Space size={8}>
                    {content?.colour.map((c, idx) => (
                      <Tooltip
                        key={idx}
                        title={c.charAt(0).toUpperCase() + c.slice(1)}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: c,
                            cursor: "pointer",
                            border: "2px solid #e0e0e0",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.15)";
                            e.currentTarget.style.borderColor = "#ffa449";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.borderColor = "#e0e0e0";
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Space>
                </div>
              )}

              <Divider style={{ margin: "8px 0" }} />

              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                  <Tooltip title="Edit">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      block
                      style={{
                        height: 50,
                        borderRadius: 8,
                        border: "none",
                        fontFamily: "DM Sans",
                        fontSize: 16,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(255, 164, 73, 0.3)",
                      }}
                      onClick={() => console.log("clicked")}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      danger
                      type="primary"
                      icon={<DeleteOutlined />}
                      block
                      style={{
                        height: 50,
                        borderRadius: 8,
                        border: "none",
                        fontFamily: "DM Sans",
                        fontSize: 16,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(255, 164, 73, 0.3)",
                      }}
                      onClick={() => console.log("clicked")}
                    />
                  </Tooltip>
                </div>
              </Space>

              {/* Free Shipping Badge */}
              {content?.freeShipping && (
                <Card
                  size="small"
                  style={{
                    background: "#f0f9ff",
                    border: "1px solid #bae7ff",
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: "12px 16px" }}
                >
                  <Space>
                    <TruckOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                    <Text
                      strong
                      style={{
                        fontFamily: "DM Sans",
                        color: "#1890ff",
                        fontSize: 14,
                      }}
                    >
                      Free Shipping Available
                    </Text>
                  </Space>
                </Card>
              )}

              {/* View More Details Link */}
              <Button
                type="link"
                // onClick={toggleDetailsDrawer}
                onClick={() => navigate(`/shop/product?id=${content?._id}`)}
                style={{
                  padding: 0,
                  height: "auto",
                  fontFamily: "DM Sans",
                  fontSize: 14,
                  color: "#ffa449",
                  fontWeight: 600,
                }}
              >
                View complete specifications →
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default React.memo(ViewItem);

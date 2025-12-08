import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  ScissorOutlined,
  StarOutlined,
  TagsOutlined,
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
  Tag,
} from "antd";
import React from "react";

const { Title, Paragraph, Text } = Typography;

function ViewItem({ loading, openModal, setOpenModal, content }) {
  const discountedPrice =
    content?.discount > 0
      ? ((100 - content?.discount) * content?.price) / 100
      : content?.price;

  return (
    <Modal
      footer={null}
      open={openModal}
      centered
      onCancel={() => setOpenModal(false)}
      confirmLoading={loading}
      width={1200}
      style={{ top: 10 }}
      closeIcon={
        <CloseOutlined
          style={{
            color: "#fff",
            fontSize: 16,
            background: "rgba(0, 0, 0, 0.55)",
            borderRadius: "50%",
            padding: 6,
          }}
        />
      }
      styles={{
        mask: { backdropFilter: "blur(2px)" },
        content: {
          background: "linear-gradient(135deg, #1b1b27, #242437 100%)",
          border: "none",
          borderRadius: 12,
          overflow: "hidden",
          padding: 0,
        },
      }}
    >
      <Row gutter={[0, 0]} style={{ minHeight: 500 }}>
        {/* LEFT: Carousel */}
        <Col
          span={8}
          style={{
            background: "linear-gradient(135deg, #fff7e8, #ffe0ba)",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Carousel autoplay autoplaySpeed={3500} dots style={{ height: 450 }}>
            {(Array.isArray(content?.img) ? content?.img : [content?.img]).map(
              (img, i) => (
                <div
                  key={i}
                  style={{
                    height: 450,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={img}
                    alt="img"
                    preview={{ mask: "View Full Image" }}
                    style={{
                      height: 450,
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )
            )}
          </Carousel>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "10px 14px",
              marginTop: "auto",
            }}
          >
            <Tooltip title="Edit">
              <Button
                type="primary"
                icon={<EditOutlined />}
                block
                style={{
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 600,
                  background: "#ffa449",
                }}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                block
                style={{
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 600,
                }}
              />
            </Tooltip>
          </div>
        </Col>

        {/* MIDDLE: Product Details */}
        <Col
          span={8}
          style={{
            background: "#fcfcfc",
            padding: "20px 22px",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <Space direction="vertical" size={22} style={{ width: "100%" }}>
            {/* Name + Type Badge */}
            <div>
              <Title
                level={2}
                style={{
                  margin: 0,
                  fontFamily: "DM Sans",
                  fontWeight: 700,
                  color: "#222",
                }}
              >
                {content?.name}
              </Title>

              {content?.type && (
                <Badge
                  count={content?.type}
                  style={{
                    background: "#ffa449",
                    padding: "0px 12px",
                    fontWeight: 600,
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                />
              )}
            </div>

            {/* Price Card */}
            <Card
              style={{
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg,#ffa449,#ff8b1a)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Text style={{ color: "#fff", opacity: 0.9 }}>Price</Text>
              <br />
              {content?.discount > 0 ? (
                <Space>
                  <Title level={3} style={{ color: "#fff", margin: 0 }}>
                    KES {discountedPrice.toLocaleString()}
                  </Title>
                  <Text delete style={{ color: "rgba(255,255,255,0.7)" }}>
                    KES {content?.price.toLocaleString()}
                  </Text>
                </Space>
              ) : (
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  KES {content?.price.toLocaleString()}
                </Title>
              )}
            </Card>

            {/* Description */}
            <Paragraph
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                lineHeight: 1.7,
                color: "#666",
              }}
            >
              {content?.description}
            </Paragraph>

            {/* Colors */}
            {content?.colour?.length > 0 && (
              <>
                <Text strong>Available Colors</Text>
                <Space>
                  {content.colour.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid #ddd",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  ))}
                </Space>
              </>
            )}

            {/* Tags */}
            {content?.tags?.length > 0 && (
              <div>
                <TagsOutlined style={{ color: "#ffa449", marginRight: 8 }} />
                {content.tags.map((tag, i) => (
                  <Tag
                    key={i}
                    style={{
                      borderRadius: 8,
                      borderColor: "#ffa449",
                      background: "rgba(255,164,73,0.12)",
                      color: "#ffa449",
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </Space>
        </Col>

        {/* RIGHT: Specs, Shipping, Care */}
        <Col
          span={8}
          style={{
            background: "#fafafa",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Specs */}
          <Card
            bordered
            style={{ borderRadius: 14 }}
            title={
              <Space>
                <ScissorOutlined style={{ color: "#ffa449" }} />
                <Text strong>Specifications</Text>
              </Space>
            }
          >
            <Space direction="vertical">
              <div>
                <Text strong style={{ color: "#777" }}>
                  MATERIAL
                </Text>
                <br />
                <Text>{content?.material}</Text>
              </div>

              <div>
                <Text strong style={{ color: "#777" }}>
                  DIMENSIONS
                </Text>
                <br />
                <Text>{content?.dimensions}</Text>
              </div>
            </Space>
          </Card>

          {/* Two small cards */}
          <Row gutter={14}>
            <Col span={12}>
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  background: "#eaf6ff",
                  borderColor: "#cce7ff",
                  height: "100%",
                }}
              >
                <Space direction="vertical">
                  <TruckOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                  <Text strong>Shipping</Text>
                  {content?.shippingInformation.map((info, i) => (
                    <Text key={i} style={{ fontSize: 12, color: "#555" }}>
                      {info}
                    </Text>
                  ))}
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  background: "#fff3e0",
                  borderColor: "#ffd8a8",
                  height: "100%",
                }}
              >
                <Space direction="vertical">
                  <InfoCircleOutlined
                    style={{ fontSize: 24, color: "#ff922b" }}
                  />
                  <Text strong>Care Guide</Text>
                  {content?.careGuide.map((info, i) => (
                    <Text key={i} style={{ fontSize: 12, color: "#555" }}>
                      {info}
                    </Text>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Additional Info */}
          {(content?.freeShipping || content?.discount > 0) && (
            <Space>
              {content?.freeShipping && (
                <Tag
                  color="green"
                  icon={<TruckOutlined />}
                  style={{ borderRadius: 8, padding: "6px 12px" }}
                >
                  Free Shipping
                </Tag>
              )}

              {content?.discount > 0 && (
                <Tag
                  color="red"
                  icon={<StarOutlined />}
                  style={{ borderRadius: 8, padding: "6px 12px" }}
                >
                  {content.discount}% OFF
                </Tag>
              )}
            </Space>
          )}
        </Col>
      </Row>
    </Modal>
  );
}

export default React.memo(ViewItem);

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Carousel,
  Col,
  Modal,
  Row,
  Typography,
  Image,
  Divider,
  Space,
  Tag,
  Card,
  Button,
} from "antd";
import { format } from "date-fns";
import { useNotification } from "../contexts/NotificationContext";

const { Title, Text, Paragraph } = Typography;

function ViewOrder({ content, loading, openModal, setOpenModal }) {
  const openNotification = useNotification();

  const order = content?.product;
  const customer = content?.customer_info;
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "orange";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <Modal
      open={openModal}
      onCancel={() => setOpenModal(false)}
      confirmLoading={loading}
      width="90%"
      bodyStyle={{
        padding: 10,
        height: "90vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "transparent",
        margin: 15,
      }}
      style={{
        top: 20,
        borderRadius: 7,
      }}
      footer={null}
    >
      <Row gutter={[32, 32]}>
        {/* Product Section */}
        <Col xs={24} md={14}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Carousel
                autoplay
                autoplaySpeed={4500}
                dots
                adaptiveHeight
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {(Array.isArray(order?.img) ? order?.img : [order?.img]).map(
                  (img, i) => (
                    <div
                      key={i}
                      style={{
                        width: "100%",
                        height: 400,
                        background: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={img}
                        alt={order?.name}
                        height={400}
                        width={"100%"}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: 12,
                        }}
                        preview={false}
                      />
                    </div>
                  )
                )}
              </Carousel>
              {order?.discount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  <Button
                    style={{
                      background: "#89cdbf",
                      color: "#fff",
                      border: "none",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      fontFamily: "DM Sans",
                      borderRadius: 7,
                    }}
                  >
                    -{order?.discount}%
                  </Button>
                </div>
              )}
            </div>

            <Divider />

            <Title level={2} style={{ fontFamily: "DM Sans", marginBottom: 0 }}>
              {order?.name}
            </Title>

            <Space direction="vertical" size={6}>
              <Title
                level={3}
                type="secondary"
                style={{ fontFamily: "DM Sans", marginBottom: 0, marginTop: 0 }}
              >
                KES{" "}
                {order?.discount > 0 ? (
                  <>
                    <span
                      style={{ textDecoration: "line-through", opacity: 0.6 }}
                    >
                      {order?.price.toLocaleString()}
                    </span>{" "}
                    <span style={{ color: "#52c41a" }}>
                      {(
                        ((100 - order?.discount) * order?.price) /
                        100
                      ).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>{order?.price.toLocaleString()}</span>
                )}
              </Title>
              <Tag color="blue" style={{ fontFamily: "DM Sans" }}>
                {order?.type?.toUpperCase()}
              </Tag>
              <Paragraph type="secondary">{order?.description}</Paragraph>
            </Space>
          </Card>
        </Col>

        {/* Order Details Section */}
        <Col xs={24} md={10}>
          <Card
            hoverable
            title="Order Summary"
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Customer:</strong> {customer?.name}
              </Text>
              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Email:</strong> {customer?.email}
              </Text>
              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Address:</strong> {customer?.address}
              </Text>
              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Phone:</strong> {customer?.phone}
              </Text>
              <Text
                type="secondary"
                style={{ cursor: "pointer", fontFamily: "DM Sans" }}
              >
                <u>View delivery location</u>
              </Text>
              <Divider />

              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Date of Order:</strong>{" "}
                {content?.date && !isNaN(new Date(content.date))
                  ? format(new Date(content.date), "PPPP")
                  : "N/A"}
              </Text>

              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Payment Method:</strong>{" "}
                <Tag
                  color={getStatusColor(content?.payment_method)}
                  style={{ fontFamily: "DM Sans" }}
                >
                  {content?.payment_method.charAt(0).toUpperCase() +
                    content?.payment_method.slice(1)}
                </Tag>
              </Text>

              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Delivery:</strong>{" "}
                {content?.delivery_option.charAt(0).toUpperCase() +
                  content?.delivery_option.slice(1)}
              </Text>

              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Amount Paid:</strong> KES{" "}
                {content?.total?.toLocaleString()}
              </Text>

              <Text style={{ fontFamily: "DM Sans" }}>
                <strong>Additional Instructions:</strong>{" "}
                {customer?.additional_info || "N/A"}
              </Text>
            </Space>
          </Card>

          {/* buttons */}
          <Card
            hoverable
            style={{
              marginTop: 10,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Space size={[2, 3]} wrap>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  console.log("clicked");
                  openNotification(
                    "Success",
                    "Order marked as delivered",
                    "Done!"
                  );
                }}
                style={{
                  background: "#52c41a",
                  color: "whitesmoke",
                  fontFamily: "DM Sans",
                }}
              >
                Mark as Delivered
              </Button>
              <Button
                type="primary"
                icon={<MailOutlined />}
                onClick={() => {
                  console.log("clicked");
                }}
                style={{
                  background: "#1890ff",
                  color: "whitesmoke",
                  fontFamily: "DM Sans",
                }}
              >
                Email Customer
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  console.log("clicked");
                  openNotification(
                    "Success",
                    "Order has been cancelled successfully",
                    "Done!"
                  );
                }}
                style={{
                  background: "#ff4d4f",
                  color: "whitesmoke",
                  fontFamily: "DM Sans",
                }}
              >
                Cancel Order
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewOrder;

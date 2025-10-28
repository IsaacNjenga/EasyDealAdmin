import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditFilled,
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
} from "antd";
import { useNotification } from "../contexts/NotificationContext";

const { Title, Paragraph, Text } = Typography;

function ViewItem({ loading, openModal, setOpenModal, content }) {
  const openNotification = useNotification();

  return (
    <>
      <Modal
        footer={null}
        open={openModal}
        centered
        onCancel={() => setOpenModal(false)}
        confirmLoading={loading}
        width={"70vw"}
        style={{ width: "auto", marginTop: 0, backgroundColor: "whitesmoke" }}
      >
        <div style={{ padding: 10, margin: 10 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={14}>
              <Carousel autoplay autoplaySpeed={4500} dots={true} arrows>
                {(Array.isArray(content?.img)
                  ? content?.img
                  : [content?.img]
                ).map((img, i) => (
                  <div key={i}>
                    <Image
                      src={img}
                      height={500}
                      alt={content?.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Title
                style={{ margin: 0, fontFamily: "DM Sans", letterSpacing: 1 }}
              >
                {content?.name}
              </Title>
              <Title
                level={3}
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                  fontFamily: "DM Sans",
                }}
                type="secondary"
              >
                KES.{" "}
                {content?.discount > 0 ? (
                  <>
                    <span style={{ textDecoration: "line-through" }}>
                      {content?.price.toLocaleString()}
                    </span>{" "}
                    <span>
                      {(
                        ((100 - content?.discount) * content?.price) /
                        100
                      ).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>{content?.price.toLocaleString()}</span>
                )}
              </Title>
              <Paragraph style={{ fontFamily: "Raleway", marginBottom: 20 }}>
                {content?.description}
              </Paragraph>
              <div style={{ marginBottom: 20 }}>
                <Text style={{ fontFamily: "DM Sans", marginBottom: 15 }}>
                  Colours available:{" "}
                </Text>
                <br />
                {content?.colour.map((c) => (
                  <Tooltip title={c.charAt(0).toUpperCase() + c.slice(1)}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        display: "inline-block",
                        borderRadius: "50%",
                        backgroundColor: `${c}`,
                        cursor: "pointer",
                        marginRight: 10,
                      }}
                    ></div>
                  </Tooltip>
                ))}
              </div>
              {/* add to cart */}
              <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                {" "}
                <Tooltip title={"Delete"} placement="right">
                  <Button
                    shape="circle"
                    onClick={() => {
                      openNotification(
                        "success",
                        "An item has been deleted successfully",
                        "Done!"
                      );
                    }}
                    icon={<DeleteOutlined />}
                    style={{
                      background: "white",
                      color: "#333",
                      border: "none",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  />
                </Tooltip>{" "}
                <Tooltip title="Edit" placement="right">
                  <Button
                    shape="circle"
                    icon={<EditFilled />}
                    //TODO:onClick={() => viewItem(b)}
                    style={{
                      background: "white",
                      color: "#333",
                      border: "none",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  />
                </Tooltip>
              </div>

              <div style={{ marginBottom: 0 }}>
                {content?.freeShipping && (
                  <Text style={{ fontFamily: "DM Sans" }}>
                    Free Shipping <CheckCircleOutlined />
                  </Text>
                )}
              </div>
              <div>
                <Text style={{ fontFamily: "DM Sans" }}>
                  TYPE: {content?.type.toUpperCase()}
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
}

export default ViewItem;

import { Modal, Card, Col, Divider, Row, Typography } from "antd";
import { formatDistanceToNowStrict } from "date-fns";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text } = Typography;

function ViewReply({ setOpenModal, openModal, loading, content }) {
  const { user } = useAuth();

  return (
    <Modal
      open={openModal}
      onCancel={() => setOpenModal(false)}
      confirmLoading={loading}
      width="90%"
      style={{
        top: 20,
        padding: "30px 32px",
        background: "#f9fafb00",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        height: "90vh",
      }}
      footer={null}
    >
      <Row gutter={[24, 24]}>
        {/* Left: Message Details */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Original Message
              </Title>
            }
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#fff",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: "block" }}>
                  From:
                </Text>
                <Text>{content?.original_message?.full_name || "N/A"}</Text>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Email Address:
                </Text>
                <a href={`mailto:${content?.original_message?.email_address}`}>
                  {content?.original_message?.email_address}
                </a>
              </div>
            </div>
            <div>
              <Text strong>
                Subject: {content?.original_message?.subject || "N/A"}
              </Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              {content?.original_message?.createdAt && (
                <Text type="secondary">
                  {`Received ${formatDistanceToNowStrict(
                    new Date(content?.original_message?.createdAt)
                  )} ago`}
                </Text>
              )}
            </div>

            <Divider style={{ borderColor: "#ccc" }} />

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Message:
              </Text>

              <p
                style={{
                  background: "#f5f5f5",
                  padding: "12px 16px",
                  borderRadius: 8,
                  minHeight: 120,
                }}
                dangerouslySetInnerHTML={{
                  __html: content?.original_message?.message,
                }}
              />
            </div>
          </Card>
        </Col>

        {/* Right: Reply Section */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Reply
              </Title>
            }
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#fff",
              height: "100%",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ display: "block" }}>
                From:
              </Text>
              <Text>{user.username || "N/A"}</Text>
            </div>{" "}
            <div>
              <Text strong>
                Subject: {content?.original_message?.subject || "N/A"}
              </Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              {content?.createdAt && (
                <Text type="secondary">
                  {`Sent ${formatDistanceToNowStrict(
                    new Date(content?.createdAt)
                  )} ago`}
                </Text>
              )}
            </div>
            <Divider style={{ borderColor: "#ccc" }} />
            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Reply:
              </Text>
              <p
                style={{
                  background: "#f5f5f5",
                  padding: "12px 16px",
                  borderRadius: 8,
                  minHeight: 120,
                }}
                dangerouslySetInnerHTML={{ __html: content?.message }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewReply;

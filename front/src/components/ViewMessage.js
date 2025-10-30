import {
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  Button,
} from "antd";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const { Title, Text, Paragraph } = Typography;

function ViewMessage({ setOpenModal, openModal, loading, content }) {
  const { token, user } = useAuth();
  const [form] = Form.useForm();
  const [sendLoading, setSendLoading] = useState(false);
  const openNotification = useNotification();

  const handleSubmit = async () => {
    setSendLoading(true);
    try {
      const values = await form.validateFields();
      const mailValues = {
        to: content.email_address,
        message: values.reply,
        name: content.full_name,
      };

      const replyValues = {
        original_message: content._id,
        message: values.reply,
        createdBy: user._id,
      };

      //console.log(allValues);
      const [res, res2, res3] = await Promise.all([
        axios.post("reply-to-email", mailValues, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.post("reply-to-db", replyValues, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.put(
          `mail-update?id=${content._id}`,
          { replied_to: true },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);
      if (res.data.success && res2.data.success && res3.data.success) {
        openNotification("success", "Reply sent", "Success!");
      }
    } catch (error) {
      console.log(error);
      openNotification(
        "warning",
        "An unexpected error occurred. Please try again or call for assistance.",
        "Error"
      );
    } finally {
      form.resetFields();
      setSendLoading(false);
      setOpenModal(false);
    }
  };

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
      }}
      footer={null}
    >
      <Row gutter={[24, 24]}>
        {/* Left: Message Details */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Message Details
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
                <Text>{content?.full_name || "N/A"}</Text>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Email Address:
                </Text>
                <a href={`mailto:${content?.email_address}`}>
                  {content?.email_address}
                </a>
              </div>
            </div>
            <div>
              <Text strong>Subject: {content?.subject}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              {content?.createdAt && (
                <Text type="secondary">
                  {`Received ${formatDistanceToNowStrict(
                    new Date(content?.createdAt)
                  )} ago`}
                </Text>
              )}
            </div>

            <Divider style={{ borderColor: "#ccc" }} />

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Message:
              </Text>
              <Paragraph
                style={{
                  background: "#f5f5f5",
                  padding: "12px 16px",
                  borderRadius: 8,
                  minHeight: 120,
                }}
              >
                {content?.message || "No message content"}
              </Paragraph>
            </div>
          </Card>
        </Col>

        {/* Right: Reply Section */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Reply to {content?.full_name || "Sender"}
              </Title>
            }
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#fff",
              height: "100%",
            }}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label="Your Reply (Will go to their email address)"
                name="reply"
                rules={[{ required: true, message: "Please write a reply" }]}
              >
                {content?.replied_to && (
                  <span style={{ color: "red" }}>
                    This message has already been replied to.
                  </span>
                )}
                <Input.TextArea
                  rows={10}
                  placeholder="Type your reply here..."
                  style={{
                    borderRadius: 8,
                    resize: "none",
                  }}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                <Button
                  type="primary"
                  size="large"
                  style={{ borderRadius: 8 }}
                  loading={sendLoading}
                  htmlType="submit"
                >
                  {sendLoading ? "Sending Reply..." : "Send Reply"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewMessage;

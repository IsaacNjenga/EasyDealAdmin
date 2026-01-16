import { Avatar, Button, Card, Col, Input, Modal, Row, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Search } = Input;

function UsersQueryModal({
  open,
  setOpen,
  username,
  setUsername,
  openNotification,
  createDM,
}) {
  const { user, token } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`query-users?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAllUsers(res.data.users.users || []);
      } else {
        openNotification(
          "error",
          "The username could be incorrect",
          "User not found"
        );
      }
    } catch (error) {
      console.error(error);
      openNotification("error", error.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  const startDM = async (id) => {
    await createDM(id);
    setOpen(false);
    setUsername("");
    setAllUsers([]);
  };

  return (
    <Modal
      title="Start a chat"
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closable={true}
      width={"800px"}
      style={{ top: 10 }}
      styles={{
        mask: { backdropFilter: "blur(1px)" },
        content: {
          background: "white",
          border: "none",
          borderRadius: 12,
          overflow: "hidden",
          padding: 30,
        },
      }}
      closeIcon={
        <CloseOutlined
          style={{
            color: "#fff",
            background: "rgba(0, 0, 0, 0.39)",
            padding: 6,
            borderRadius: "50%",
            fontSize: 20,
            marginBottom: 80,
            marginLeft: 10,
          }}
        />
      }
    >
      <Search
        placeholder="Search username"
        size="large"
        value={username}
        loading={loading}
        onChange={(e) => setUsername(e.target.value)}
        onSearch={handleSearchUsers}
        style={{ marginBottom: "10px" }}
      />

      <div style={{ marginTop: "10px" }}>
        {!allUsers.length && <Text type="secondary">No users found</Text>}

        <Row gutter={[16, 16]}>
          {allUsers
            .filter((u) => u.id !== user.userId)
            .map((chatUser) => (
              <Col xs={24} md={12} lg={8} key={chatUser.id}>
                <Card
                  style={{
                    background: "#171617",
                    border: "none",
                    borderRadius: 20,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Avatar src={chatUser.avatar} size="large" />
                    <Text strong style={{ color: "white", display: "block" }}>
                      {chatUser.username}
                    </Text>
                    <Text>
                      {chatUser.online ? (
                        <span style={{ color: "green" }}>Online</span>
                      ) : (
                        <span style={{ color: "grey" }}>Offline</span>
                      )}
                    </Text>
                    <div style={{ marginTop: 12 }}>
                      <Button
                        type="primary"
                        onClick={() => startDM(chatUser.id)}
                      >
                        Chat
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
    </Modal>
  );
}

export default UsersQueryModal;

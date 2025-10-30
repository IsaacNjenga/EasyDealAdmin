import React from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  List,
  Timeline,
  Button,
  Divider,
  Spin,
} from "antd";
import {
  MailOutlined,
  StarOutlined,
  SendOutlined,
  HomeOutlined,
  BarChartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { format, formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import useFetchAvailableProducts from "../hooks/fetchAvailableProducts";
import useFetchAllEmails from "../hooks/fetchAllEmails";
import useFetchAllReplies from "../hooks/fetchAllReplies";
import useFetchActivity from "../hooks/fetchActivity";

const { Title, Text } = Typography;

function Home() {
  // static placeholders for now
  const navigate = useNavigate();
  const { products, productsLoading } = useFetchAvailableProducts();
  const { emails, emailsLoading } = useFetchAllEmails();
  const { replies, repliesLoading } = useFetchAllReplies();
  const { activities, activitiesLoading } = useFetchActivity();

  const unreadMessages = emails?.filter((email) => email.read === false);
  const starredMessages = emails?.filter((email) => email.starred === true);

  const stats = [
    {
      title: "Unread Messages",
      value: emailsLoading ? <Spin /> : unreadMessages.length,
      icon: <MailOutlined />,
      color: "#1890ff",
    },
    {
      title: "Starred",
      value: emailsLoading ? <Spin /> : starredMessages.length,
      icon: <StarOutlined />,
      color: "#faad14",
    },
    {
      title: "Replies Sent",
      value: repliesLoading ? <Spin /> : replies?.length,
      icon: <SendOutlined />,
      color: "#52c41a",
    },
    {
      title: "Active Products",
      value: productsLoading ? <Spin /> : products?.length,
      icon: <HomeOutlined />,
      color: "#722ed1",
    },
  ];

  const activitiesDescriptions = activities.map((activity) => activity.title);

  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <div></div>
        <div>
          <Title level={4} style={{ fontFamily: "Roboto" }}>
            {format(new Date(), "EEEE, do MMMM")}
          </Title>
        </div>
      </div>

      <Divider />

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((item, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <Card
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Text strong style={{ fontSize: 15, color: "#595959" }}>
                    {item.title}
                  </Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {item.value}
                  </Title>
                </div>
                <div
                  style={{
                    background: item.color,
                    color: "#fff",
                    borderRadius: "50%",
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Recent Messages & Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card
            title="Recent Messages"
            extra={<Link to="/emails">View All</Link>}
            style={{ borderRadius: 12 }}
          >
            {activitiesLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={activities.filter(
                  (activity) => activity.type === "mail"
                )}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{item.title}</Text>}
                      description={item.description}
                    />
                    <Text type="secondary">
                      {formatDistanceToNow(new Date(item.createdAt))} ago
                    </Text>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Quick actions */}
        <Col xs={24} md={8}>
          <Card title="Quick Actions" style={{ borderRadius: 12 }}>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => navigate("/create-product")}
              >
                Add A Product
              </Button>
              <Button
                icon={<MailOutlined />}
                onClick={() => navigate("/emails")}
              >
                View Messages
              </Button>
              {/* <Button
                icon={<UserOutlined />}
                onClick={() => navigate("/create-property")}
              >
                Manage Users
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => navigate("/create-property")}
              >
                Settings
              </Button> */}
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Activity Timeline */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChartOutlined /> <span>Recent Activity</span>
          </div>
        }
        style={{ borderRadius: 12 }}
      >
        {activitiesLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Timeline
            items={activitiesDescriptions.map((a) => ({ children: a }))}
            size="large"
          />
        )}
      </Card>
    </div>
  );
}

export default Home;

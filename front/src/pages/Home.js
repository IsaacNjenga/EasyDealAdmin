import {
  Card,
  Row,
  Col,
  Typography,
  List,
  Avatar,
  Button,
  Space,
  Timeline,
  Spin,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  BarChartOutlined,
  FireFilled,
  ClockCircleFilled,
  LikeFilled,
  MailOutlined,
  StarOutlined,
  AppstoreOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import DashUtils from "../utils/dashboardUtils";
import { formatDistanceToNow } from "date-fns";

const { Title, Text } = Typography;

const MiniBarChart = ({ data }) => {
  const max = Math.max(...data?.map((d) => d.value));
  const colors = ["#1890ff", "#52c41a", "#faad14", "#722ed1"];

  return (
    <div
      style={{
        margin: "auto",
        width: "100%",
        padding: 16,
        background: "linear-gradient(135deg, #667eea28 0%, #764ba21c 100%)",
        height: "100%",
        borderRadius: 12,
      }}
    >
      <svg width="100%" height="130" style={{ display: "block" }}>
        {data.map((d, i) => {
          const barWidth = 60 / data.length;
          const x = 10 + (i * 90) / data.length;
          const height = (d.value / max) * 120;
          const y = 130 - height;

          return (
            <rect
              key={i}
              x={`${x}%`}
              y={y}
              width={`${barWidth}%`}
              height={height}
              fill={colors[i % colors.length]}
              rx="4"
            />
          );
        })}
      </svg>
    </div>
  );
};

const Header = () => {
  const currentDate = new Date();
  const navigate = useNavigate();
  const dateString = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "32px",
        borderRadius: "16px",
        marginBottom: "10px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              color: "white",
              margin: 0,
              marginBottom: "8px",
              fontFamily: "Raleway",
            }}
          >
            {dateString}
          </Title>
        </div>
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/create-product")}
            style={{
              background: "white",
              color: "#667eea",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
            }}
          >
            Add Product
          </Button>
        </Space>
      </div>
    </div>
  );
};

const QuickStats = () => {
  const { stats } = DashUtils();
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      {stats.map((item, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "none",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#8c8c8c",
                    display: "block",
                    marginBottom: 8,
                    fontFamily: "Raleway",
                  }}
                >
                  {item.title}
                </Text>
                <Title
                  level={2}
                  style={{ margin: 0, marginBottom: 8, fontFamily: "Raleway" }}
                >
                  {item.loading ? <Spin size="large" /> : item.value}
                </Title>
              </div>
              <div
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 24,
                }}
              >
                {item.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const TopProducts = () => {
  const { topViewed, summaryLoading } = DashUtils();

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FireFilled style={{ color: "#ff4d4f" }} />
          <span
            style={{ fontSize: 16, fontWeight: 600, fontFamily: "Raleway" }}
          >
            Top Performing Products
          </span>
        </div>
      }
      extra={
        <Button type="link" style={{ fontFamily: "Raleway" }}>
          <Link to="/products">View All</Link>
        </Button>
      }
      style={{
        borderRadius: 16,
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={topViewed?.slice(0, 3)}
        loading={summaryLoading}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: "16px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={70}
                  src={item.productId?.img[0]}
                  style={{ width: 58, height: 58, borderRadius: 8 }}
                />
              }
              title={
                <Text strong style={{ fontSize: 16, fontFamily: "Raleway" }}>
                  {item.productId?.name}
                </Text>
              }
              description={
                <Space direction="vertical" size={4}>
                  <Text
                    style={{
                      color: "#52c41a",
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "Raleway",
                    }}
                  ></Text>
                  <Space size={16}>
                    <span>
                      <EyeOutlined
                        style={{ color: "#8c8c8c", marginRight: 4 }}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#8c8c8c",
                          fontFamily: "Raleway",
                        }}
                      >
                        {item.views?.toLocaleString()}
                      </Text>
                    </span>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

const RecentActivity = () => {
  const { recentActivities } = DashUtils();

  const IconRender = (type) => {
    switch (type) {
      case "Order":
        return <TruckOutlined style={{ color: "#faad14" }} />;
      case "order":
        return <TruckOutlined style={{ color: "#faad14" }} />;
      case "reply":
        return <MailOutlined style={{ color: "#faad14" }} />;
      case "mail":
        return <MailOutlined style={{ color: "#faad14" }} />;
      case "review":
        return <LikeFilled style={{ color: "red" }} />;
      case "Product":
        return <AppstoreOutlined style={{ color: "#52c41a" }} />;
      case "product":
        return <AppstoreOutlined style={{ color: "#52c41a" }} />;
      default:
        return <StarOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ClockCircleFilled style={{ color: "#2ea0d1ff" }} />
              <span
                style={{ fontSize: 16, fontWeight: 600, fontFamily: "Raleway" }}
              >
                Recent Activity
              </span>
            </div>
          }
          style={{
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Timeline
            items={recentActivities.slice(0, 10).map((activity, idx) => ({
              dot: (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      idx === 0
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : "#f0f0f0",
                    color: idx === 0 ? "white" : "#8c8c8c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {IconRender(activity.type)}
                </div>
              ),
              children: (
                <div style={{ paddingBottom: 16 }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      fontSize: 15,
                      marginBottom: 4,
                      fontFamily: "Raleway",
                    }}
                  >
                    {activity.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#8c8c8c",
                      fontFamily: "Roboto",
                    }}
                  >
                    {formatDistanceToNow(new Date(activity.time))} ago
                  </Text>
                </div>
              ),
            }))}
          />
        </Card>
      </Col>
    </Row>
  );
};

function Home() {
  const loading = false;

  const { productTypes, productsLoading } = DashUtils();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <Header />

      {/* Stats Cards */}
      <QuickStats />

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={14}>
          <TopProducts />
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChartOutlined style={{ color: "#1890ff" }} />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "Raleway",
                  }}
                >
                  Properties by Type
                </span>
              </div>
            }
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            {productsLoading ? (
              <Spin
                size="large"
                style={{ margin: "auto", width: "100%", padding: 20 }}
              />
            ) : (
              <>
                <MiniBarChart data={productTypes} />
                <Divider />
                <div
                  style={{
                    marginTop: 16,
                    background:
                      "linear-gradient(to top, #667eea0f 0%, #764ba20f 100%)",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  {productTypes?.map((item, i) => {
                    const colors = ["#1890ff", "#52c41a", "#faad14", "#722ed1"];
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: colors[i],
                            }}
                          />
                          <Text style={{ fontFamily: "Raleway" }}>
                            {item.type}
                          </Text>
                        </div>
                        <Text strong style={{ fontFamily: "Raleway" }}>
                          {item.value}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}

export default Home;

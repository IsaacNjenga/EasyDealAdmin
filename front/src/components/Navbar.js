import React, { useState } from "react";
import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  FloatButton,
  Layout,
  Menu,
  Tooltip,
  Typography,
} from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/icons/office-chair.png";
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  BellOutlined,
  HomeOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  PushpinOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import "../assets/css/navbar.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function getItem(label, path, key, icon, children) {
  return { key, icon, path, children, label };
}

const items = [
  getItem("Dashboard", "/", 1, HomeOutlined),
  getItem("Products", "", 2, AppstoreOutlined, [
    getItem("View products", "/products", 3, AppstoreOutlined),
    getItem("Create a product", "/create-product", 4, AppstoreAddOutlined),
  ]),
  getItem("Emails", "/emails", 5, MailOutlined),
  getItem("Orders", "/orders", 6, TruckOutlined),
  getItem("Activity", "/activity", 7, BellOutlined),
  getItem("Newsletter", "/newsletter", 8, PushpinOutlined),
];

const flattenItems = (arr) =>
  arr.reduce((acc, item) => {
    if (item.children) acc.push(...flattenItems(item.children));
    else acc.push(item);
    return acc;
  }, []);

// Find the matching menu item label
const getTitleFromPath = (path) => {
  const allItems = flattenItems(items);
  const found = allItems.find((item) => item.path === path);
  return found ? found.label : "Dashboard";
};

function Navbar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(location.pathname);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <FloatButton
        description=""
        tooltip={collapsed ? "Open" : "Collapse"}
        type="primary"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed((prev) => !prev)}
        style={{
          left: 24,
          bottom: 24,
          right: "auto",
          fontSize: "14px",
          position: "fixed",
          zIndex: 1000,
        }}
      />
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onBreakpoint={(broken) => setCollapsed(broken)}
          width={300}
          style={{
            padding: 6,
            background:
              "linear-gradient(to bottom, #000000d6 0%, #232527ff 100%)",
          }}
        >
          <div style={{ margin: "4px 0px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      width: collapsed ? "65px" : "105px",
                      height: collapsed ? "65px" : "105px",
                      borderRadius: "50%",
                      transition: "all 0.3s ease-in-out",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: collapsed ? "none" : "flex",
                    margin: 0,
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Title
                    style={{
                      color: "whitesmoke",
                      fontFamily: "Raleway",
                      margin: 0,
                    }}
                    level={2}
                  >
                    EasyDeal Admin
                  </Title>
                  {user && (
                    <Divider
                      style={{
                        borderColor: "white",
                        width: "80%",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <Text
                        style={{
                          color: "whitesmoke",
                          fontFamily: "Raleway",
                          margin: 0,
                        }}
                      >
                        {user?.username}
                      </Text>
                    </Divider>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: collapsed ? "none" : "flex",
                  justifyContent: "center",
                  fontSize: "3rem",
                }}
              ></div>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemColor: "#fea549", // Default text color
                    itemHoverColor: "#fea549", // Color when hovering
                    itemSelectedColor: "#fea549", // Color when selected
                    horizontalItemSelectedColor: "#fea549", // Underline color
                    itemBg: "transparent", // Background color
                  },
                },
              }}
            >
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[current]}
                onClick={handleClick}
                inlineCollapsed={collapsed}
                style={{
                  fontFamily: "Raleway",
                  border: "none",
                  background: "transparent",
                }}
                items={items.map(({ key, icon, label, path, children }) => ({
                  key: path || key,
                  icon: React.createElement(icon, {
                    style: {
                      fontSize: collapsed ? "1.5rem" : "1.8rem",
                      color: "whitesmoke",
                      margin: "4px 0",
                    },
                  }),
                  label: path ? (
                    <Link
                      to={path}
                      style={{
                        fontSize: "18px",
                        color: "whitesmoke",
                      }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <Text
                      style={{
                        fontSize: "18px",
                        color: "whitesmoke",
                        fontFamily: "Raleway",
                      }}
                    >
                      {label}
                    </Text>
                  ),
                  children: children?.map((child) => ({
                    key: child.path || child.key,
                    icon: React.createElement(child.icon, {
                      style: {
                        fontSize: collapsed ? "1.5rem" : "1.7rem",
                        color: "whitesmoke",
                        margin: "4px 0px",
                      },
                    }),
                    label: (
                      <Link
                        to={child.path}
                        style={{
                          fontSize: "16px",
                          color: "whitesmoke",
                          background: "transparent",
                          fontFamily: "Raleway",
                        }}
                      >
                        {child.label}
                      </Link>
                    ),
                  })),
                  style: {
                    textAlign: "left",
                    margin: collapsed ? "14px 4.1px" : "19px 4.1px",
                  },
                }))}
              />
            </ConfigProvider>
          </div>
        </Sider>{" "}
        <Layout>
          <Header
            style={{
              padding: 0,
              background:
                "linear-gradient(to left, #ffffffd6 0%, #ffffffff 100%)",
              borderBottom: "1px solid #ccc",
              height: 80,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                paddingBottom: 20,
              }}
            >
              <div style={{ marginLeft: 10 }}>
                <Title style={{ fontFamily: "Raleway" }}>
                  {getTitleFromPath(current)}
                </Title>
              </div>

              <div style={{ marginRight: 20 }}>
                <Tooltip title={user?.username}>
                  <Avatar
                    src={user?.avatar}
                    size="medium"
                    style={{ marginRight: 15 }}
                  />
                </Tooltip>
                <Tooltip title="Logout">
                  <Button
                    type="primary"
                    icon={<PoweroffOutlined />}
                    danger
                    shape="circle"
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You will be logged out.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          await logout();
                        } else {
                          return;
                        }
                      });
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </Header>

          <Content
            style={{
              margin: "0px",
              padding: 20,
              minHeight: "100vh",
              borderRadius: 0,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Navbar;

import { Avatar, Card, Table, Tag, Typography } from "antd";
import React, { useState } from "react";
import { ordersData } from "../assets/data/data.js";
import { formatDistanceToNowStrict } from "date-fns";
import ViewOrder from "../components/ViewOrder.js";
const { Text } = Typography;

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "orange";
    case "mpesa":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "blue";
  }
};

const columns = [
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
    render: (product) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar
          shape="square"
          size={70}
          src={product.img[0]}
          alt={product.name}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
        <div>
          <Text style={{ fontFamily: "DM Sans", fontWeight: 600 }}>
            {product.name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
            {product.type}
          </Text>
        </div>
      </div>
    ),
  },
  {
    title: "Customer",
    dataIndex: "customer_info",
    key: "customer_info",
    render: (customer) => (
      <div>
        <Text style={{ fontFamily: "DM Sans" }}>{customer.full_name}</Text>
        <br />
        <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
          {customer.email}
        </Text>
      </div>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => (
      <Text style={{ fontFamily: "DM Sans" }}>
        {`${formatDistanceToNowStrict(new Date(text))} ago`}
      </Text>
    ),
  },
  {
    title: "Price",
    dataIndex: "total",
    key: "total",
    render: (text) => (
      <Text style={{ fontFamily: "DM Sans" }}>KES {text.toLocaleString()}</Text>
    ),
  },
  {
    title: "Payment",
    dataIndex: "payment_method",
    key: "payment_method",
    render: (method) => (
      <Tag color={getStatusColor(method)} style={{ fontFamily: "DM Sans" }}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Tag>
    ),
  },
  {
    title: "Delivery",
    dataIndex: "delivery_option",
    key: "delivery_option",
    render: (text) => (
      <Text style={{ fontFamily: "DM Sans" }}>
        {text.charAt(0).toUpperCase() + text.slice(1)}
      </Text>
    ),
  },
];

const tabListTitleStyle = {
  fontFamily: "DM Sans",
  fontSize: "16px",
};

const tabList = [
  { key: "tab1", tab: <span style={tabListTitleStyle}>All Orders</span> },
  { key: "tab2", tab: <span style={tabListTitleStyle}>Delivered Orders</span> },
  { key: "tab3", tab: <span style={tabListTitleStyle}>Pending Orders</span> },
  { key: "tab4", tab: <span style={tabListTitleStyle}>Canceled Orders</span> },
];

function Orders() {
  const [activeTabKey, setActiveTabKey] = useState("tab1");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Flatten each order so each product becomes its own row
  const flattenedOrders = ordersData.flatMap((order) => {
    return order.order.map((item) => ({
      _id: `${order._id}-${item._id}`, // unique key per item
      product: item, // single product object
      customer_info: order.customer_info,
      payment_method: order.payment_method,
      total: item.price, // or calculate subtotal if needed
      quantity: item.quantity,
      delivery_option: order.delivery_option,
      date: order.date,
      parentOrderId: order._id, // keep reference to original order
    }));
  });

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const viewOrder = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const contentList = {
    tab1: (
      <>
        {" "}
        <Table
          dataSource={flattenedOrders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size="large"
          //loading={ordersLoading}
          style={{ fontFamily: "Raleway" }}
          onRow={(record) => ({
            onClick: () => {
              viewOrder(record);
            },
          })}
        />
      </>
    ),
    tab2: (
      <>
        {" "}
        <Table
          dataSource={flattenedOrders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size="large"
          //loading={ordersLoading}
          style={{ fontFamily: "Raleway" }}
          onRow={(record) => ({
            onClick: () => {
              viewOrder(record);
            },
          })}
        />
      </>
    ),
    tab3: (
      <>
        {" "}
        <Table
          dataSource={flattenedOrders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size="large"
          //loading={ordersLoading}
          style={{ fontFamily: "Raleway" }}
          onRow={(record) => ({
            onClick: () => {
              viewOrder(record);
            },
          })}
        />
      </>
    ),
    tab4: (
      <>
        {" "}
        <Table
          dataSource={flattenedOrders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size="large"
          //loading={ordersLoading}
          style={{ fontFamily: "Raleway" }}
          onRow={(record) => ({
            onClick: () => {
              viewOrder(record);
            },
          })}
        />
      </>
    ),
  };

  return (
    <div>
      <Card
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
      >
        {contentList[activeTabKey]}
      </Card>

      <ViewOrder
        content={content}
        loading={loading}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
}

export default Orders;

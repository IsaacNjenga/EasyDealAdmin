import { Avatar, Card, Table, Typography } from "antd";
import React, { useState } from "react";
import { ordersData } from "../assets/data/data.js";
import { formatDistanceToNowStrict } from "date-fns";
import ViewOrder from "../components/ViewOrder.js";
const { Text } = Typography;

const columns = [
  {
    title: "Order",
    dataIndex: "order",
    key: "order",
    render: (text) => (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Avatar src={text.img[0]} size="105" />
        <Text style={{ fontFamily: "DM Sans" }}>{text.name}</Text>
      </div>
    ),
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    render: (text) => (
      <Text style={{ fontFamily: "DM Sans" }}>{text.name}</Text>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => (
      <Text style={{ fontFamily: "DM Sans" }}>{`${formatDistanceToNowStrict(
        new Date(text)
      )} ago`}</Text>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text) => (
      <Text
        style={{ fontFamily: "DM Sans" }}
      >{`KES ${text.toLocaleString()}`}</Text>
    ),
  },
  {
    title: "Payment Status",
    dataIndex: "payment_status",
    key: "payment_status",
    render: (text) => <Text style={{ fontFamily: "DM Sans" }}>{text}</Text>,
  },
  {
    title: "Items",
    dataIndex: "items",
    key: "items",
    render: (text) => <Text style={{ fontFamily: "DM Sans" }}>{text}</Text>,
  },
  {
    title: "Delivery Method",
    dataIndex: "delivery_method",
    key: "delivery_method",
    render: (text) => <Text style={{ fontFamily: "DM Sans" }}>{text}</Text>,
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
          dataSource={ordersData}
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
          dataSource={ordersData}
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
          dataSource={ordersData}
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
          dataSource={ordersData}
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
        //tabBarExtraContent={<a href="#">More</a>}
        onTabChange={onTabChange}
        tabProps={{
          size: "middle",
        }}
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

import { Avatar, Table, Typography } from "antd";
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
        <Avatar src={text.img[0]} size="75" />
        <Text>{text.name}</Text>
      </div>
    ),
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    render: (text) => `${text.name}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => `${formatDistanceToNowStrict(new Date(text))} ago`,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text) => `KES ${text.toLocaleString()}`,
  },
  {
    title: "Payment Status",
    dataIndex: "payment_status",
    key: "payment_status",
  },
  { title: "Items", dataIndex: "items", key: "items" },
  {
    title: "Delivery Method",
    dataIndex: "delivery_method",
    key: "delivery_method",
  },
];

function Orders() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const viewOrder = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Table
        dataSource={ordersData}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        size="small"
        //loading={ordersLoading}
        style={{ fontFamily: "Raleway" }}
        onRow={(record) => ({
          onClick: () => {
            viewOrder(record);
          },
        })}
      />

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

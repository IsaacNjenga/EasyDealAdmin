import { Avatar, Table, Typography } from "antd";
import React from "react";
import { ordersData } from "../assets/data/data.js";
import { formatDistanceToNowStrict } from "date-fns";
const { Text } = Typography;

function Orders() {
  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={text.img[0]} size="65" />
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
        // onRow={(record) => ({
        //   onClick: () => {
        //     if (selectedTab === 4) {
        //       // For replies
        //       viewReply(record);
        //     } else {
        //       viewMessage(record);
        //     }
        //   },
        // })}
      />
    </div>
  );
}

export default Orders;

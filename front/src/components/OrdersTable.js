import React, { useState } from "react";
import { Table, Avatar, Typography, Tag } from "antd";
import { format, formatDistanceToNowStrict } from "date-fns";
import ViewOrder from "./ViewOrder.js";

const { Text } = Typography;

const columns = [
  {
    title: "Customer",
    dataIndex: "customer_info",
    key: "customer_info",
    render: (customer) => (
      <div>
        <Text style={{ fontFamily: "DM Sans", fontWeight: 600 }}>
          {customer.full_name}
        </Text>
        <br />
        <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
          {customer.email}
        </Text>
      </div>
    ),
  },
  {
    title: "Order Date",
    dataIndex: "date",
    key: "date",
    render: (text) => {
      if (!text) return "-";
      const parsedDate = new Date(text);
      if (isNaN(parsedDate)) return "-";
      return (
        <div>
          <Text style={{ fontFamily: "DM Sans" }}>
            {`${formatDistanceToNowStrict(parsedDate)} ago`}
          </Text>
          <br />
          <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
            {format(parsedDate, "dd/MM/yyyy")}
          </Text>
        </div>
      );
    },
  },
  {
    title: "Payment",
    dataIndex: "payment_method",
    key: "payment_method",
    render: (method) => (
      <Tag color="green" style={{ fontFamily: "DM Sans" }}>
        {method?.charAt(0).toUpperCase() + method?.slice(1)}
      </Tag>
    ),
  },
  {
    title: "Delivery",
    dataIndex: "delivery_option",
    key: "delivery_option",
    render: (text) => (
      <Text style={{ fontFamily: "DM Sans" }}>
        {text?.charAt(0).toUpperCase() + text?.slice(1)}
      </Text>
    ),
  },
  {
    title: "Total Items",
    key: "total_items",
    render: (_, record) => record.order?.length || 0,
  },
  {
    title: "Total Cost",
    dataIndex: "total",
    key: "total",
    render: (total) => (
      <Text style={{ fontFamily: "DM Sans" }}>
        KES {total?.toLocaleString()}
      </Text>
    ),
  },
];

const expandedRowRender = (record) => {
  const innerColumns = [
    {
      title: "Product",
      key: "product",
      render: (_, item) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            shape="square"
            size={70}
            src={item.img?.[0]}
            alt={item.name}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <div>
            <Text style={{ fontFamily: "DM Sans", fontWeight: 600 }}>
              {item.name}
            </Text>
            <br />
            <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
              {item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <Text style={{ fontFamily: "DM Sans" }}>
          {text} item{text > 1 ? "s" : ""}
        </Text>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text style={{ fontFamily: "DM Sans" }}>
          KES {price?.toLocaleString()}
        </Text>
      ),
    },
  ];

  return (
    <Table
      columns={innerColumns}
      dataSource={record.order}
      pagination={false}
      rowKey={(item) => item._id}
    />
  );
};

const OrdersTable = ({ data }) => {
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
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.order && record.order.length > 0,
        }}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        size="large"
        //loading={ordersLoading}
        style={{ fontFamily: "DM Sans" }}
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
};

export default OrdersTable;

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

const innerColumns = [
  {
    title: "Product",
    key: "product",
    render: (_, record) => {
      const product = record.order[0];
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            shape="square"
            size={70}
            src={product?.img?.[0]}
            alt={product?.name}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <div>
            <Text style={{ fontFamily: "DM Sans", fontWeight: 600 }}>
              {product?.name}
            </Text>
            <br />
            <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
              {product?.type?.charAt(0).toUpperCase() + product?.type?.slice(1)}
            </Text>
          </div>
        </div>
      );
    },
  },
  {
    title: "Quantity",
    key: "quantity",
    render: (_, record) => {
      const product = record.order[0];
      return (
        <Text style={{ fontFamily: "DM Sans" }}>
          {product?.quantity} item{product?.quantity > 1 ? "s" : ""}
        </Text>
      );
    },
  },
  {
    title: "Price",
    key: "price",
    render: (_, record) => {
      const product = record.order[0];
      return (
        <Text style={{ fontFamily: "DM Sans" }}>
          KES {product?.price?.toLocaleString()}
        </Text>
      );
    },
  },
];

const ExpandedRowRender = ({
  record,
  setLoading,
  setContent,
  setOpenModal,
}) => {
  const viewOrder = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const enrichedData = record?.order.map((item) => ({
    ...record,
    order: [item],
  }));

  return (
    <Table
      columns={innerColumns}
      dataSource={enrichedData}
      pagination={false}
      rowKey={(item) => item._id}
      onRow={(record) => ({
        onClick: () => {
          viewOrder(record);
          console.log(record);
        },
      })}
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
          expandedRowRender: (record) => (
            <ExpandedRowRender
              record={record}
              setLoading={setLoading}
              setContent={setContent}
              setOpenModal={setOpenModal}
            />
          ),
          rowExpandable: (record) => record.order && record.order.length > 0,
        }}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        size="large"
        //loading={ordersLoading}
        style={{ fontFamily: "DM Sans" }}
        onRow={(record) => ({
          onClick: () => {
            if (record.order.length === 1) {
              viewOrder(record);
            } else {
              // do nothing, as the row is expandable
            }
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

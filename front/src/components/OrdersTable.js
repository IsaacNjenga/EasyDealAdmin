import { useState } from "react";
import { Table, Avatar, Typography, Tag, Dropdown, Button } from "antd";
import { format, formatDistanceToNowStrict } from "date-fns";
import ViewOrder from "./ViewOrder.js";
import {
  MoreOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "../assets/css/orders.css";
import { useAuth } from "../contexts/AuthContext/index.js";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

const { Text } = Typography;

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
            size={55}
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
  {
    title: "Discount on item",
    key: "discount",
    render: (_, record) => {
      const product = record.order[0];
      return (
        <Tag
          style={{ fontFamily: "DM Sans", background: "red", color: "white" }}
        >
          {product?.discount ? product.discount.toLocaleString() : "0"}%
        </Tag>
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
      size="small"
      bordered
      rowKey={(item) => item._id}
      onRow={(record) => ({
        onClick: () => {
          viewOrder(record);
          console.log(record);
        },
      })}
      rowClassName={(record) => {
        if (record.order_status === "delivered") return "row-delivered";
        if (record.order_status === "pending") return "row-pending";
        if (record.order_status === "cancelled") return "row-cancelled";
        return "";
      }}
    />
  );
};

const OrdersTable = ({ data, ordersLoading, ordersRefresh }) => {
  const { token } = useAuth();
  const openNotification = useNotification();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const updateOrder = async (id, updateData) => {
    try {
      const res = await axios.put(`order-update?id=${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        openNotification("success", "", "Done!");
      }
    } catch (error) {
      console.error("Failed to update mail", error);
      openNotification(
        "error",
        "Failed to update order. Try again",
        "There was an error"
      );
    }
  };

  const handleMenuClick = async (e, record) => {
    const { key } = e;
    setActiveDropdownId(null); // close after click

    if (key === "toggle-delivered") {
      // If already delivered → revert to pending
      const newStatus =
        record.order_status === "delivered" ? "pending" : "delivered";
      await updateOrder(record._id, { order_status: newStatus });
    } else if (key === "toggle-cancel") {
      // If already cancelled → revert to pending
      const newStatus =
        record.order_status === "cancelled" ? "pending" : "cancelled";
      await updateOrder(record._id, { order_status: newStatus });
    }

    ordersRefresh(); // refresh the list
  };

  const viewOrder = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer_info",
      key: "customer_info",
      render: (customer) => (
        <div>
          <Text style={{ fontFamily: "DM Sans", fontWeight: 600 }}>
            {customer.first_name} {customer.last_name}
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
      title: "Delivery Option",
      dataIndex: "delivery_option",
      key: "delivery_option",
      render: (text) => (
        <Text style={{ fontFamily: "DM Sans", textAlign: "center" }}>
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
    {
      title: "",
      key: "item-action",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              {
                label:
                  record.order_status === "delivered" ? (
                    <span style={{ color: "orange" }}>
                      <ExclamationCircleOutlined style={{ color: "orange" }} />{" "}
                      Mark as Pending
                    </span>
                  ) : (
                    <span style={{ color: "green" }}>
                      <CheckCircleOutlined style={{ color: "green" }} /> Mark as
                      Delivered
                    </span>
                  ),
                key: "toggle-delivered",
              },
              {
                label:
                  record.order_status === "cancelled" ? (
                    <span style={{ color: "orange", fontWeight: 500 }}>
                      <ExclamationCircleOutlined
                        style={{ color: "orange", fontWeight: 500 }}
                      />{" "}
                      Mark as Pending
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: 500 }}>
                      <CloseCircleOutlined style={{ color: "red" }} /> Cancel
                      Order
                    </span>
                  ),
                key: "toggle-cancel",
              },
            ],
            onClick: (e) => handleMenuClick(e, record),
          }}
          trigger={["click"]}
          open={activeDropdownId === record._id}
          onOpenChange={(nextOpen) =>
            setActiveDropdownId(nextOpen ? record._id : null)
          }
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

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
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys([record._id]); // only one expanded at a time
            } else {
              setExpandedRowKeys([]);
            }
          },
        }}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        size="medium"
        bordered
        loading={ordersLoading}
        style={{ fontFamily: "DM Sans" }}
        onRow={(record) => ({
          onClick: () => {
            if (record.order.length === 1) {
              // Open modal if there's only one item
              viewOrder(record);
            } else if (record.order.length > 1) {
              // Expand the row instead
              const isExpanded = expandedRowKeys.includes(record._id);
              setExpandedRowKeys(isExpanded ? [] : [record._id]);
            }
          },
        })}
        rowClassName={(record) => {
          if (record.order_status === "delivered") return "row-delivered";
          if (record.order_status === "pending") return "row-pending";
          if (record.order_status === "cancelled") return "row-cancelled";
          return "";
        }}
      />

      <ViewOrder
        content={content}
        loading={loading}
        openModal={openModal}
        setOpenModal={setOpenModal}
        updateOrder={updateOrder}
        ordersRefresh={ordersRefresh}
      />
    </div>
  );
};

export default OrdersTable;

import { useState } from "react";
import { Card, Tag } from "antd";
import OrdersTable from "../components/OrdersTable.js";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  CloseCircleFilled,
  SwitcherFilled,
  SwitcherOutlined,
} from "@ant-design/icons";
import useFetchAllOrders from "../hooks/fetchAllOrders.js";
//import { ordersData } from "../assets/data/data.js";

const tabs = [
  {
    key: 1,
    label: "All Orders",
    color: "purple",
    color2: "#cbcbfdff",
    icon: SwitcherFilled,
    icon2: SwitcherOutlined,
  },

  {
    key: 2,
    label: "Pending Orders",
    color: "orange",
    color2: "#f7eebe",
    icon: ExclamationCircleFilled,
    icon2: ExclamationCircleOutlined,
  },
  {
    key: 3,
    label: "Delivered Orders",
    color: "green",
    color2: "#cff8e8",
    icon: CheckCircleFilled,
    icon2: CheckCircleOutlined,
  },
  {
    key: 4,
    label: "Cancelled Orders",
    color: "red",
    color2: "#fad2cf",
    icon: CloseCircleFilled,
    icon2: CloseCircleOutlined,
  },
];

const Orders = () => {
  const [activeTabKey, setActiveTabKey] = useState(1);
  const { orders, ordersLoading, ordersRefresh } = useFetchAllOrders();
  // const orders = ordersData;
  // const ordersLoading = false;
  // const ordersRefresh = () => {};

  const renderContent = () => {
    switch (activeTabKey) {
      case 1:
        return (
          <OrdersTable
            data={orders}
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      case 2:
        return (
          <OrdersTable
            data={orders.filter((o) => o.order_status === "pending")}
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      case 3:
        return (
          <OrdersTable
            data={orders.filter((o) => o.order_status === "delivered")}
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      case 4:
        return (
          <OrdersTable
            data={orders.filter((o) => o.order_status === "cancelled")}
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          margin: "10px 0",
          marginTop: 0,
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((btn) => (
          <Tag
            color={activeTabKey === btn.key ? btn.color : ""}
            key={btn.key}
            onClick={() => setActiveTabKey(btn.key)}
            style={{
              fontSize: 14,
              padding: "10px 14px",
              cursor: "pointer",
              fontFamily: "DM Sans",
              borderRadius: 20,
              transition: "0.2s",
              background: activeTabKey === btn.key ? btn.color : btn.color2,
              color: activeTabKey === btn.key ? "white" : "#333",
            }}
          >
            {activeTabKey === btn.key ? <btn.icon /> : <btn.icon2 />}{" "}
            <span style={{ marginLeft: 6 }}>{btn.label}</span>
          </Tag>
        ))}
      </div>

      <Card style={{ width: "100%" }}>{renderContent()}</Card>
    </>
  );
};

export default Orders;

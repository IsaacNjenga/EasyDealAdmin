import { useState } from "react";
import { Card, Tag } from "antd";
import { ordersData } from "../assets/data/data.js";
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

const tabs = [
  {
    key: 1,
    label: "All Orders",
    color: "purple",
    icon: SwitcherFilled,
    icon2: SwitcherOutlined,
  },
  {
    key: 2,
    label: "Delivered Orders",
    color: "green",
    icon: CheckCircleFilled,
    icon2: CheckCircleOutlined,
  },
  {
    key: 3,
    label: "Pending Orders",
    color: "gold",
    icon: ExclamationCircleFilled,
    icon2: ExclamationCircleOutlined,
  },
  {
    key: 4,
    label: "Cancelled Orders",
    color: "red",
    icon: CloseCircleFilled,
    icon2: CloseCircleOutlined,
  },
];

const Orders = () => {
  const [activeTabKey, setActiveTabKey] = useState(1);

  const renderContent = () => {
    switch (activeTabKey) {
      case 1:
        return <OrdersTable data={ordersData} />;
      case 2:
        return (
          <OrdersTable
            data={ordersData.filter((o) => o.status === "delivered")}
          />
        );
      case 3:
        return (
          <OrdersTable
            data={ordersData.filter((o) => o.status === "pending")}
          />
        );
      case 4:
        return (
          <OrdersTable
            data={ordersData.filter((o) => o.status === "cancelled")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ✅ Tag Tabs */}
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
              background: activeTabKey === btn.key ? btn.color : "#f0f0f0",
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

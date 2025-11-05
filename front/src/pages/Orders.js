import { useState } from "react";
import { Card, Input, Tag } from "antd";
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

const { Search } = Input;

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
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [searchValue, setSearchValue] = useState(null);

  const renderContent = () => {
    switch (activeTabKey) {
      case 1:
        return (
          <OrdersTable
            data={searchValue ? order : orders}
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      case 2:
        return (
          <OrdersTable
            data={
              searchValue
                ? order.filter((o) => o.order_status === "pending")
                : orders.filter((o) => o.order_status === "pending")
            }
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      case 3:
        return (
          <OrdersTable
            data={
              searchValue
                ? order.filter((o) => o.order_status === "delivered")
                : orders.filter((o) => o.order_status === "delivered")
            }
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      case 4:
        return (
          <OrdersTable
            data={
              searchValue
                ? order.filter((o) => o.order_status === "cancelled")
                : orders.filter((o) => o.order_status === "cancelled")
            }
            ordersLoading={ordersLoading}
            ordersRefresh={ordersRefresh}
          />
        );
      default:
        return null;
    }
  };

  const handleSearch = (e) => {
    setLoading(true);
    try {
      const value = e.target.value.toLowerCase().trim();
      setSearchValue(value);
      if (!value) {
        setOrder([]);
        return;
      }

      const filteredSearchData = orders.filter((item) => {
        // Combine searchable text
        const textToSearch = [
          item._id,
          item.total?.toString(),
          item.customer_info?.first_name,
          item.customer_info?.last_name,
          item.customer_info?.email,
          item.payment_method,
          item.delivery_option,
          item.order_status,
          ...(item.order?.map((p) => `${p.name} ${p.type}`) || []),
        ]
          .filter(Boolean)
          .join(" ") // combine all fields
          .toLowerCase();

        return textToSearch.includes(value);
      });

      setOrder(filteredSearchData);
    } catch (error) {
      console.warn("Search error:", error);
    } finally {
      setLoading(false);
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

      <div style={{ marginTop: 20 }}>
        <Search
          placeholder="Search orders..."
          size="large"
          loading={loading}
          enterButton
          onChange={handleSearch}
          style={{ width: "100%", height: 50 }}
        />
      </div>

      <Card style={{ width: "100%" }}>{renderContent()}</Card>
    </>
  );
};

export default Orders;

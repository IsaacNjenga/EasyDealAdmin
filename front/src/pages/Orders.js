import { useState } from "react";
import { Card } from "antd";
import { ordersData } from "../assets/data/data.js";
import OrdersTable from "../components/OrdersTable.js";

const Orders = () => {
  const tabListTitleStyle = {
    fontFamily: "DM Sans",
    fontSize: "16px",
  };

  const tabList = [
    { key: "tab1", tab: <span style={tabListTitleStyle}>All Orders</span> },
    {
      key: "tab2",
      tab: <span style={tabListTitleStyle}>Delivered Orders</span>,
    },
    { key: "tab3", tab: <span style={tabListTitleStyle}>Pending Orders</span> },
    {
      key: "tab4",
      tab: <span style={tabListTitleStyle}>Canceled Orders</span>,
    },
  ];

  const [activeTabKey, setActiveTabKey] = useState("tab1");

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const contentList = {
    tab1: (
      <>
        <OrdersTable data={ordersData} />
      </>
    ),
    tab2: (
      <>
        <OrdersTable data={ordersData} />
      </>
    ),
    tab3: (
      <>
        <OrdersTable data={ordersData} />
      </>
    ),
    tab4: (
      <>
        <OrdersTable data={ordersData} />
      </>
    ),
  };

  return (
    <Card
      style={{ width: "100%" }}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
};

export default Orders;

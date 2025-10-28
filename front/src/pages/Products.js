import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
import { shopProducts } from "../assets/data/data";
import ItemCard from "../components/ItemCard";
import ViewItem from "../components/ViewItem";

function Products() {
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const viewItem = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => setLoading(false), 100);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Refresh">
          <Button
            //onClick={propertiesRefresh}
            type="primary"
            icon={<ReloadOutlined />}
          />
        </Tooltip>
      </div>

      <div>
        <ItemCard
          dataSource={shopProducts}
          isMobile={false}
          viewItem={viewItem}
        />
      </div>
      <ViewItem
        setOpenModal={setOpenModal}
        openModal={openModal}
        loading={loading}
        content={content}
      />
    </div>
  );
}

export default Products;

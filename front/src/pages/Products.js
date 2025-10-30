import React, { useState } from "react";
import { Button, Spin, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
//import { shopProducts } from "../assets/data/data";
import ItemCard from "../components/ItemCard";
import ViewItem from "../components/ViewItem";
import useFetchAllProducts from "../hooks/fetchAllProducts";

function Products() {
  const { products, productsLoading, productsRefresh, handleLoadMore } =
    useFetchAllProducts();
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
            onClick={productsRefresh}
            type="primary"
            icon={<ReloadOutlined />}
          />
        </Tooltip>
      </div>

      <div>
        {productsLoading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <ItemCard
            dataSource={products}
            isMobile={false}
            viewItem={viewItem}
          />
        )}
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

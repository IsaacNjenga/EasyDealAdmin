import { useState } from "react";
import { Button, Spin, Tooltip } from "antd";
import { PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons";
//import { shopProducts } from "../assets/data/data";
import ItemCard from "../components/ItemCard";
import ViewItem from "../components/ViewItem";
import useFetchAllProducts from "../hooks/fetchAllProducts";
import { useNavigate } from "react-router-dom";

function Products() {
  const { products, productsLoading, productsRefresh, handleLoadMore } =
    useFetchAllProducts();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const viewItem = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => setLoading(false), 100);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Tooltip title="Add a product">
          <Button
            onClick={() => navigate("/create-product")}
            type="primary"
            icon={<PlusCircleOutlined />}
            style={{ background: "green" }}
          />
        </Tooltip>
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
            setLoading={setLoading}
            productsRefresh={productsRefresh}
          />
        )}
      </div>

      <div style={{ marginTop: 20, marginBottom: 50, textAlign: "center" }}>
        <Button
          onClick={handleLoadMore}
          type="primary"
          size="large"
          style={{ fontFamily: "Raleway" }}
        >
          Load More
        </Button>
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

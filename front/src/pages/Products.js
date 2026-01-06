import { useState } from "react";
import { Button, Input, Spin, Tooltip } from "antd";
import { PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import ItemCard from "../components/ItemCard";
import ViewItem from "../components/ViewItem";
//import useFetchAllProducts from "../hooks/fetchAllProducts";
import { useNavigate } from "react-router-dom";
import useFetchProducts from "../hooks/fetchProducts";

const { Search } = Input;

function Products() {
  // const { products, productsLoading, productsRefresh, handleLoadMore } =
  //   useFetchAllProducts();
  const { products, productsLoading, productsRefresh } = useFetchProducts();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const viewItem = (content) => {
    setLoading(true);
    setContent(content);
    setOpenModal(true);
    setTimeout(() => setLoading(false), 100);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchTerm(value);
    if (!value) return;

    const filteredSearchData = products.filter((item) => {
      const values = Object.values(item);
      return values.some(
        (val) => typeof val === "string" && val.toLowerCase().includes(value)
      );
    });

    setFilteredData(filteredSearchData);
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <div>
          <Search
            placeholder="Search products..."
            size="large"
            loading={loading}
            enterButton
            onChange={handleSearch}
            allowClear
            style={{ width: 500, height: 50 }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Tooltip title="Add a product">
            <Button
              onClick={() => navigate("/create-product")}
              type="primary"
              icon={<PlusCircleOutlined />}
              style={{ background: "green", height: 40 }}
            >
              Add Product
            </Button>
          </Tooltip>
          <Tooltip title="Refresh">
            <Button
              onClick={productsRefresh}
              type="primary"
              icon={<ReloadOutlined />}
              style={{ height: 40 }}
            >
              Refresh Products
            </Button>
          </Tooltip>
        </div>
      </div>

      <div>
        {productsLoading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <ItemCard
            dataSource={searchTerm ? filteredData : products}
            isMobile={false}
            viewItem={viewItem}
            setLoading={setLoading}
            productsRefresh={productsRefresh}
          />
        )}
      </div>
      {/* 
      <div style={{ marginTop: 20, marginBottom: 50, textAlign: "center" }}>
        <Button
          onClick={handleLoadMore}
          type="primary"
          size="large"
          style={{ fontFamily: "Raleway" }}
        >
          Load More
        </Button>
      </div> */}

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

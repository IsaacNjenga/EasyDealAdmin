import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

function useFetchProduct() {
  const { token } = useAuth();
  const openNotification = useNotification();
  const [productData, setProductData] = useState({});
  const [productDataLoading, setProductDataLoading] = useState(false);

  const fetchProduct = async (id) => {
    if (!id) return;
    setProductDataLoading(true);
    try {
      const res = await axios.get(`fetch-product?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setProductData(res.data.product);
      }
    } catch (error) {
      console.error("Error in fetching Product:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unexpected error occurred. Please try again later.";
      openNotification("warning", errorMessage, "Error");
    } finally {
      setProductDataLoading(false);
    }
  };

  return {
    productData,
    productDataLoading,
    fetchProduct,
  };
}

export default useFetchProduct;

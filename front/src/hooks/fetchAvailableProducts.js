import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

function useFetchAvailableProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const openNotification = useNotification();
  const [productsLoading, setProductsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await axios.get(`/fetch-available-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setProducts(res.data.availableProduct);
        setErrorMessage(null);
      } else {
        setErrorMessage(res.data.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      openNotification("warning", errorMessage, "Error");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    products,
    productsLoading,
    errorMessage,
    productsRefresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchAvailableProducts;

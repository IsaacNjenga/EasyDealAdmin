import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

function useFetchAllProducts() {
  const { token } = useAuth();
  const openNotification = useNotification();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchProducts = async (pageNum = 1, refresh = false) => {
    setProductsLoading(true);
    try {
      if (refresh) setRefreshing(true);

      const res = await axios.get(
        `/fetch-all-products?page=${pageNum}&limit=8`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const uniqueProducts =
          refresh || pageNum === 1
            ? res.data.products
            : Array.from(
                new Set(
                  [...products, ...res.data.products].map(
                    (property) => property._id
                  )
                )
              ).map((id) =>
                [...products, ...res.data.products].find(
                  (property) => property._id === id
                )
              );

        setProducts(uniqueProducts);
        setHasMore(pageNum < res.data.totalPages);
        setPage(pageNum);
        setErrorMessage(null);
      } else {
        setErrorMessage(res.data.message || "Failed to fetch Products.");
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      openNotification("warning", errorMessage, "Error");
    } finally {
      setRefreshing(false);
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    //eslint-disable-next-line
  }, [refreshKey]);

  const handleLoadMore = async () => {
    if (hasMore && !productsLoading && !refreshing) {
      await fetchProducts(page + 1);
    }
  };

  return {
    products,
    productsLoading,
    errorMessage,
    productsRefresh: () => setRefreshKey((prev) => prev + 1),
    handleLoadMore,
  };
}

export default useFetchAllProducts;

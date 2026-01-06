// import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";
// import { useNotification } from "../contexts/NotificationContext";

// function useFetchAllProducts() {
//   const { token } = useAuth();
//   const openNotification = useNotification();
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [errorMessage, setErrorMessage] = useState(null);

//   const fetchProducts = async (pageNum = 1, refresh = false) => {
//     setProductsLoading(true);
//     try {
//       if (refresh) setRefreshing(true);

//       const res = await axios.get(
//         `/fetch-all-products?page=${pageNum}&limit=8`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.data.success) {
//         const uniqueProducts =
//           refresh || pageNum === 1
//             ? res.data.products
//             : Array.from(
//                 new Set(
//                   [...products, ...res.data.products].map(
//                     (property) => property._id
//                   )
//                 )
//               ).map((id) =>
//                 [...products, ...res.data.products].find(
//                   (property) => property._id === id
//                 )
//               );

//         setProducts(uniqueProducts);
//         setHasMore(pageNum < res.data.totalPages);
//         setPage(pageNum);
//         setErrorMessage(null);
//       } else {
//         setErrorMessage(res.data.message || "Failed to fetch Products.");
//       }
//     } catch (error) {
//       console.error("Error fetching Products:", error);
//       setErrorMessage("An unexpected error occurred. Please try again later.");
//       openNotification("warning", errorMessage, "Error");
//     } finally {
//       setRefreshing(false);
//       setProductsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     //eslint-disable-next-line
//   }, [refreshKey]);

//   const handleLoadMore = async () => {
//     if (hasMore && !productsLoading && !refreshing) {
//       await fetchProducts(page + 1);
//     }
//   };

//   return {
//     products,
//     productsLoading,
//     errorMessage,
//     productsRefresh: () => setRefreshKey((prev) => prev + 1),
//     handleLoadMore,
//   };
// }

// export default useFetchAllProducts;

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

function useFetchAllProducts() {
  const openNotification = useNotification();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Use ref to track abort controller
  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(
    async (pageNum = 1, refresh = false) => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setProductsLoading(true);

      try {
        if (refresh) {
          setRefreshing(true);
          setProducts([]); // Clear products immediately for better UX
        }

        const res = await axios.get(
          `/fetch-all-products?page=${pageNum}&limit=12`
        );

        if (res.data.success) {
          setProducts((prev) => {
            if (refresh || pageNum === 1) {
              return res.data.products;
            }

            // Simple deduplication using Set
            const existingIds = new Set(prev.map((p) => p._id));
            const newProducts = res.data.products.filter(
              (p) => !existingIds.has(p._id)
            );

            return [...prev, ...newProducts];
          });

          setHasMore(pageNum < res.data.totalPages);
          setPage(pageNum);
          setErrorMessage(null);
        } else {
          setErrorMessage(res.data.message || "Failed to fetch Products.");
          openNotification("warning", res.data.message, "Error");
        }
      } catch (error) {
        // Don't show error for cancelled requests
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
          return;
        }

        console.error("Error fetching Products:", error);
        const message =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again later.";
        setErrorMessage(message);
        openNotification("warning", message, "Error");
      } finally {
        setRefreshing(false);
        setProductsLoading(false);
      }
    },
    [openNotification]
  );

  useEffect(() => {
    fetchProducts(1, false);

    // Cleanup: cancel any pending requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !productsLoading && !refreshing) {
      fetchProducts(page + 1, false);
    }
  }, [hasMore, productsLoading, refreshing, page, fetchProducts]);

  const productsRefresh = useCallback(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  return {
    products,
    productsLoading,
    errorMessage,
    productsRefresh,
    handleLoadMore,
    hasMore,
  };
}

export default useFetchAllProducts;

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

function useFetchAllOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const openNotification = useNotification();
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await axios.get(`fetch-all-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
        setNewOrders(
          res.data.orders.filter((o) => o.order_status === "pending")
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unexpected error occurred. Please try again later.";

      openNotification("warning", errorMessage, "Error");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    orders,
    newOrders,
    ordersLoading,
    ordersRefresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchAllOrders;

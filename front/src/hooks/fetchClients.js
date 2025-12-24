import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";

function useFetchClients() {
  const { token } = useAuth();
  const openNotification = useNotification();
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const res = await axios.get(`fetch-clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClients(res.data.clients);
      }
    } catch (error) {
      console.error("Error in fetching clients:", error);
      openNotification(
        "warning",
        "Try refreshing your page",
        "Something went wrong..."
      );
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    //eslint-disable-next-line
  }, [refreshKey]);

  return {
    clients,
    clientsLoading,
    clientsRefresh: () => setRefreshKey((prevKey) => prevKey + 1),
  };
}

export default useFetchClients;

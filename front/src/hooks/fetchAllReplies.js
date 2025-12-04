import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

function useFetchAllReplies() {
  const { token } = useAuth();
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const openNotfication = useNotification();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchReplies = async () => {
    setRepliesLoading(true);
    try {
      const res = await axios.get(`fetch-replies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setReplies(res.data.replies);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unexpected error occurred. Please try again later.";

      openNotfication("warning", errorMessage, "Error");
    } finally {
      setRepliesLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    replies,
    repliesLoading,
    repliesRefresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchAllReplies;

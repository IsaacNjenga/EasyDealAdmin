import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";

function useFetchAnalytics() {
  const { token } = useAuth();
  const openNotification = useNotification();
  const [summary, setSummary] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAnalytics = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.get(`fetch-analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (error) {
      console.error("Error in fetching analytics:", error);
      openNotification(
        "warning",
        "Try refreshing your page",
        "Something went wrong..."
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchTopAnalytics = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.get(`top-analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setTopViewed(res.data.topViewed);
      }
    } catch (error) {
      console.error("Error in fetching analytics:", error);
      openNotification(
        "warning",
        "Try refreshing your page",
        "Something went wrong..."
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchTopAnalytics();
    //eslint-disable-next-line
  }, [refreshKey]);

  return {
    summary,
    topViewed,
    summaryLoading,
    summaryRefresh: () => setRefreshKey((prevKey) => prevKey + 1),
  };
}

export default useFetchAnalytics;

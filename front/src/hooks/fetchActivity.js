import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function useFetchActivity() {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const res = await axios.get("fetch-activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setActivities(res.data.activities);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  //fetch every 30 seconds
  //   useEffect(() => {
  //     fetchActivities();

  //     const interval = setInterval(fetchActivities, 30000); // 30 seconds
  //     return () => clearInterval(interval);
  //   }, [token]);

  //fetch while user looks at dashboard. - more efficient
  useEffect(() => {
    let interval;

    const startPolling = () => {
      interval = setInterval(fetchActivities, 30000);
    };

    const stopPolling = () => {
      clearInterval(interval);
    };

    //start immediately
    fetchActivities();
    startPolling();

    //pause when tab is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopPolling();
      else {
        fetchActivities();
        startPolling();
      }
    });

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", () => {});
    };

    //eslint-disable-next-line
  }, [token]);

  return {
    activities,
    activitiesLoading,
    activitiesRefresh: fetchActivities,
  };
}

export default useFetchActivity;

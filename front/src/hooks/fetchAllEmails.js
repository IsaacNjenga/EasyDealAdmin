import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

function useFetchAllEmails() {
  const { token } = useAuth();
  const [emails, setEmails] = useState([]);
  const openNotification = useNotification();
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEmails = async () => {
    setEmailsLoading(true);
    try {
      const res = await axios.get(`fetch-mails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setEmails(res.data.mails);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unexpected error occurred. Please try again later.";

      openNotification("warning", errorMessage, "Error");
    } finally {
      setEmailsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    //eslint-disable-next-line
  }, [refreshKey]);

  return {
    emails,
    emailsLoading,
    emailsRefresh: () => setRefreshKey((prev) => prev + 1),
  };
}

export default useFetchAllEmails;

import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import Auth from "../pages/Auth";
import { useNotification } from "../contexts/NotificationContext";

function ProtectedRoutes({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const openNotification = useNotification();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    try {
      const decoded = jwtDecode(token);

      // Check expiration (exp is in seconds, convert to ms)
      const expiryTime = decoded.exp * 1000;

      if (Date.now() >= expiryTime) {
        logout();

        openNotification(
          "warning",
          "Your session has expired. Please log in again.",
          "Session Expired"
        );
      } else {
        // Optional: schedule auto logout just before expiry
        const timeout = expiryTime - Date.now();

        const timer = setTimeout(() => {
          logout();
          openNotification(
            "warning",
            "Your session has expired. Please log in again.",
            "Session Expired"
          );
        }, timeout);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
      openNotification(
        "warning",
        "Your session is not authenticated. Please log in again.",
        "Session Error!"
      );
    }
  }, [token, isAuthenticated, logout, openNotification]);

  if (!isAuthenticated || !token) {
    return <Auth />; // or redirect to login page
  }

  return children;
}

export default ProtectedRoutes;

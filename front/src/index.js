import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NewsletterProvider } from "./contexts/NewsletterContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <NotificationProvider>
            <NewsletterProvider>
              <ConfigProvider
                theme={{
                  components: {
                    Menu: {
                      itemColor: "#fea549", // Default text color
                      itemHoverColor: "#fea549", // Color when hovering
                      itemSelectedColor: "#fea549", // Color when selected
                      horizontalItemSelectedColor: "#fea549", // Underline color
                      itemBg: "transparent", // Background color
                    },
                    Card: {
                      colorPrimary: "#fea549",
                    },
                  },
                }}
              >
                <App />
              </ConfigProvider>
            </NewsletterProvider>
          </NotificationProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

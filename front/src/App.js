import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Emails from "./pages/Emails";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import { Spin } from "antd";
import Auth from "./pages/Auth";
import ProtectedRoutes from "./components/ProtectedRoutes";

//axios.defaults.baseURL = "http://localhost:3001/EasyAdmin";
axios.defaults.baseURL = "https://easy-deal-admin-server.vercel.app/EasyAdmin";
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spin fullscreen tip="Authenticating..." size="large" />;

  return (
    <>
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Navbar />
              </ProtectedRoutes>
            }
          >
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="create-product" element={<CreateProduct />} />
            <Route path="update-product/:id" element={<UpdateProduct />} />
            <Route path="emails" element={<Emails />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;

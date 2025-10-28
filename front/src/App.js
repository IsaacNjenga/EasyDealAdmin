import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Emails from "./pages/Emails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="update-product/:id" element={<UpdateProduct />} />
        <Route path="emails" element={<Emails />} />
      </Route>
    </Routes>
  );
}

export default App;

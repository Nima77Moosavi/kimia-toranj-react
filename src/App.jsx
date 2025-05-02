import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import HighlightMedia from "./components/HighlightMedia/HighlightMedia";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Login from "./pages/Login/Login";


import BestsellersPage from "./pages/BestsellersPage/BestsellersPage";

import Blog from "./pages/Blog/Blog";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ManageCollections from "./pages/ManageCollections/ManageCollections";
import CreateCollection from "./pages/CreateCollection/CreateCollection";
import ManageProducts from "./pages/ManageProducts/ManageProducts";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import AdminLayout from "./pages/AdminDashboard/AdminLayout/AdminLayout";
import UserPanel from "./pages/UserPanel/UserPanel";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import UserOrders from "./pages/UserOrders/UserOrders";
import Wishlist from "./pages/WishList/WishList";
import UserReviews from "./pages/UserReviews/UserReviews";
import UserAddresses from "./pages/UserAddresses/UserAddresses";



const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // اسکرول به بالای صفحه هنگام تغییر مسیر
  }, [pathname]);

  return null;
};

const App = () => {
  
  
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* General routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/highlight/:id" element={<HighlightMedia />} />
        <Route path="/collection/:id" element={<CollectionDetail />} />

        <Route path="/productDetails/:id" element={<ProductDetails/>} />
        <Route path="/bestsellersPage" element={<BestsellersPage/>} />

        <Route path="/user-panel" element={<UserPanel />} />
        <Route path="/account-info" element={<AccountInfo />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reviews" element={<UserReviews />} />
        <Route path="/addresses" element={<UserAddresses />} />


        {/* Default Redirect */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HighlightMedia from "./components/HighlightMedia/HighlightMedia";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import ProductDetails from "./pages/ProductDetails/productDetails";
import Login from "./pages/Login/Login";
import BestsellersPage from "./pages/BestsellersPage/BestsellersPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* General routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/highlight/:id" element={<HighlightMedia />} />
        <Route path="/collection/:id" element={<CollectionDetail />} />
        <Route path="/productDetails/:id" element={<ProductDetails/>} />
        <Route path="/bestsellersPage" element={<BestsellersPage/>} />

        {/* Default Redirect */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

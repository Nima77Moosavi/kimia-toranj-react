import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HighlightMedia from "./components/HighlightMedia/HighlightMedia";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ManageCollections from "./pages/ManageCollections/ManageCollections";
import CreateCollection from "./pages/CreateCollection/CreateCollection";
import ManageProducts from "./pages/ManageProducts/ManageProducts";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import AdminLayout from "./pages/AdminDashboard/AdminLayout/AdminLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* General routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/highlight/:id" element={<HighlightMedia />} />
        <Route path="/collection/:id" element={<CollectionDetail />} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Routes with AdminRoute Protection */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              {/* Managing Collections */}
              <Route
                path="/admin/collections"
                element={<ManageCollections />}
              />
              <Route
                path="/admin/collections/create"
                element={<CreateCollection />}
              />

              {/* Managing Products */}
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route
                path="/admin/products/create/"
                element={<CreateProduct />}
              />
            </Route>
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HighlightMedia from "./components/HighlightMedia/HighlightMedia";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* General routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/highlight/:id" element={<HighlightMedia />} />
        <Route path="/collection/:id" element={<CollectionDetail />} />

        {/* Default Redirect */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

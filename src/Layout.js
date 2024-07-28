import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./Home/page";
import AdminLogin from "./Admin/Login/page";
import Dashboard from "./Admin/Dashboard/page";
import DashboardLayout from "./Admin/Dashboard/DashboardLayout";

const Layout = () => {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<DashboardLayout />} />
    </Routes>
  );
};

export default Layout;

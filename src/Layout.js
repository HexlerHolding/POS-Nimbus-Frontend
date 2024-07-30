import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./Home/page";
import AdminLogin from "./Admin/Login/page";
import UserLogin from "./UserLogin/page";
import DashboardLayout from "./Admin/Dashboard/DashboardLayout";
import CashierDashboardLayout from "./Cashier/Dashboard/DashboardLayout";
import ManagerDashboardLayout from "./Manager/DashboardLayout";


const Layout = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/admin/dashboard" element={<DashboardLayout />} />
      <Route path="/cashier/dashboard" element={<CashierDashboardLayout />} />
      <Route path="/manager/dashboard" element={<ManagerDashboardLayout />} />
    </Routes>
  );
};

export default Layout;

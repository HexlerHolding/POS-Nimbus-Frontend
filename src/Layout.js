import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./Home/page";
import Contact from "./Home/contact";
import AdminLogin from "./Admin/Login/page";
import UserLogin from "./UserLogin/page";
import DashboardLayout from "./Admin/Dashboard/DashboardLayout";
import CashierDashboardLayout from "./Cashier/Dashboard/DashboardLayout";
import ManagerDashboardLayout from "./Manager/DashboardLayout";
import Orders from "./Kitchen/Orders/page";
import CashierLogin from "./Cashier/Login/page";
import ManagerLogin from "./Manager/Login/page";
import KitchenLogin from "./Kitchen/Login/page";
import Login from "./Login/login";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/cashier/login" element={<CashierLogin />} />
      <Route path="/manager/login" element={<ManagerLogin />} />
      <Route path="/kitchen/login" element={<KitchenLogin />} />
      <Route path="/admin/dashboard" element={<DashboardLayout />} />
      <Route path="/manager/dashboard" element={<ManagerDashboardLayout />} />
      <Route path="/cashier/dashboard" element={<CashierDashboardLayout />} />
      <Route path="/kitchen/orders" element={<Orders />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Layout;

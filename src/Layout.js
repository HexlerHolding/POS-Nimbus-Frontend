import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardLayout from "./Admin/Dashboard/DashboardLayout";
import AdminLogin from "./Admin/Login/page";
import AllInOneLogin from "./AllInOne";
import CashierDashboardLayout from "./Cashier/Dashboard/DashboardLayout";
import CashierLogin from "./Cashier/Login/page";
import Contact from "./Home/contact";
import Home from "./Home/page";
import KitchenLogin from "./Kitchen/Login/page";
import Orders from "./Kitchen/Orders/page";
import Login from "./Login/login";
import ManagerDashboardLayout from "./Manager/DashboardLayout";
import ManagerLogin from "./Manager/Login/page";
import Profile from "./Manager/Profile/ManagerProfile";
import UserLogin from "./UserLogin/page";

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
      <Route path="/profile" element={<Profile />} />
      <Route path="/allinone" element={<AllInOneLogin />} />

    </Routes>
  );
};

export default Layout;

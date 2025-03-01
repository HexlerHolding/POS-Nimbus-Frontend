import React, { useEffect, useState } from "react";
import { AiOutlineBranches } from "react-icons/ai";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FaBars } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import Logo from "../../Assets/LogoWhite.png";
import pfp2 from "../../Assets/pfp2.jpeg";
import AdminService from "../../Services/adminService";
import BranchPage from "./BranchManagement/ViewBranches";
import ManagerManagement from "./ManagerManagement/page";
import Order from "./Orders/order";
import Dashboard from "./page";
import ProductPage from "./Product/page";
import AdminProfile from "./Profile/AdminProfile";

import AuthService from "../../Services/authService";
import useStore from "../../Store/store";

const DashboardLayout = () => {
  const [show, handleShow] = useState(false);
  const [showUser, handleShowUser] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [adminProfile, setAdminProfile] = useState(null);
  const { userRole, setUserRole } = useStore();

  useEffect(() => {
    if (!userRole || userRole === "null" || userRole !== "admin") {
      window.location.href = "/login";
    } else {
      // Fetch admin profile when logged in
      const fetchAdminProfile = async () => {
        try {
          const response = await AdminService.getAdminProfile();
          if (response.data) {
            setAdminProfile(response.data);
          }
        } catch (error) {
          console.error("Error fetching admin profile:", error);
        }
      };

      fetchAdminProfile();
    }
  }, [userRole]);

  const handleLogout = async () => {
    try {
      const response = await AuthService.logout();
      if (response.data.message) {
        setUserRole(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return userRole !== "admin" ? null : (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Side Menu */}
      <div
        className={`h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
          show ? "w-64 p-4 shadow-2xl border-r-4 border-gray-600" : "w-0 p-0 border-0"
        } shrink-0`}
        style={{ backgroundColor: "#3a6ddf" }}
      >
        {show && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-base font-semibold text-white uppercase">
                Menu
              </h5>
              <button
                onClick={() => handleShow(!show)}
                type="button"
                className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <div className="mt-10 mb-4 flex justify-center">
              <img src={Logo} alt="logo" className="w-20 h-20" />
            </div>
          </>
        )}
        {show && (
          <div className="relative">
            <button
              onClick={() => handleShow(!show)}
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-0 right-0"
            >
              
            </button>
          </div>
        )}
        {show && (
          <div className="py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setSelected("Dashboard")}
              >
                <svg
                  className="w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setSelected("Orders")}
              >
                <svg
                  className="w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span className="ms-3">Orders</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setSelected("Manager Management")}
              >
                <HiUserGroup className="w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" />

                <span className="ms-3">Manager Management</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setSelected("Branch Management")}
              >
                <AiOutlineBranches className="w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Branch Management</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span className="inline-flex items-center justify-center w-30 h-3 p-3 ms-3 text-sm font-medium text-white bg-blue-100 rounded-full dark:bg-blue-900 dark:text-white">
                  Coming soon
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setSelected("Products")}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Products / Categories</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setSelected("Profile")}
              >
                <BiUser className="w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Profile</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={handleLogout}
              >
                <BiLogOut className="w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </a>
            </li>
          </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <nav className="bg-white border-gray-200 dark:bg-gray-100">
          <div className="flex items-center justify-between p-4 mx-0">
            {/* Left Section: Hamburger Menu and Logo */}
            <div className="flex items-center">
              {/* Hamburger Menu */}
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => handleShow(!show)}
              >
                <FaBars className="h-6 w-6" />
              </button>
              {/* Nimbus Logo */}
              <a className="flex items-center space-x-3">
                <img src={Logo} className="h-8" alt="Nimbus360 Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-gray-800">
                  Nimbus<span className="text-blue-500">360</span>
                </span>
              </a>
            </div>
            {/* Right Section: User Profile */}
            <div className="flex items-center gap-5 relative">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={() => handleShowUser(!showUser)}
              >
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src={pfp2} alt="User photo" />
              </button>
              {/* User Dropdown */}
              {showUser && (
                <div className="absolute right-0 top-10 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {adminProfile 
                        ? `${adminProfile.admin.first_name} ${adminProfile.admin.last_name}` 
                        : 'Loading...'}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {adminProfile 
                        ? adminProfile.admin.email 
                        : 'Loading...'}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        onClick={() => setSelected("Profile")}
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        onClick={handleLogout}
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Render the selected page */}
        <div className="flex-grow overflow-x-hidden">
          {selected === "Dashboard" && <Dashboard />}
          {selected === "Orders" && <Order />}
          {selected === "Manager Management" && <ManagerManagement />}
          {selected === "Branch Management" && <BranchPage />}
          {selected === "Products" && <ProductPage />}
          {selected === "Profile" && <AdminProfile />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
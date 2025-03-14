import React, { useEffect, useState } from "react";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FaBars } from "react-icons/fa";
import Logo from "../../Assets/LogoWhite.png";
import pfp2 from "../../Assets/pfp2.jpeg";

import AuthService from "../../Services/authService";
import cashierService from "../../Services/cashierService";
import useStore from "../../Store/store";
import Home from "./Home/page";
import Orders from "./Orders/page";
import CashierProfile from "./Profile/CashierProfile";

const CashierDashboardLayout = () => {
  const [show, handleShow] = useState(false);
  const [showUser, handleShowUser] = useState(false);
  const [selected, setSelected] = useState("Home");
  const [cashierProfile, setCashierProfile] = useState(null);
  const { userRole, setUserRole } = useStore();

  useEffect(() => {
    console.log(userRole);
    if (userRole === "null" || userRole === null || userRole !== "cashier") {
      window.location.href = "/login";
    } else {
      // Fetch cashier profile when logged in
      const fetchCashierProfile = async () => {
        try {
          const response = await cashierService.getCashierProfile();
          if (response.data) {
            setCashierProfile(response.data);
          }
        } catch (error) {
          console.error("Error fetching cashier profile:", error);
        }
      };

      fetchCashierProfile();
    }
  }, [userRole]);

  const handleLogout = async () => {
    try {
      const response = await AuthService.logout();
      console.log(response);
      if (response.data.message) {
        setUserRole(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return userRole !== "cashier" ? null : (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-100">
        <div
          className={`flex items-center justify-between ${
            selected === "Home" ? "w-2/3" : "w-full"
          } p-4`}
        >
          {/* Left Section: Hamburger Menu and Logo */}
          <div className="flex items-center">
            {/* Hamburger Menu */}
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none mr-3"
              onClick={() => handleShow(!show)}
            >
              <FaBars className="h-6 w-6" />
            </button>
            {/* Nimbus Logo */}
            <a className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src={Logo} className="h-8" alt="Nimbus360 Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-gray-800">
                Nimbus<span className="text-blue-500">360</span>
              </span>
            </a>
          </div>
          {/* Right Section */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => handleShowUser(!showUser)}
            >
              <span className="sr-only">Open user menu</span>
              <img 
                className="w-8 h-8 rounded-full" 
                src={cashierProfile?.shop?.logo || pfp2} 
                alt="User photo" 
              />
            </button>
            {/* User Dropdown */}
            {showUser && (
              <div className="absolute right-10 top-14 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {cashierProfile 
                      ? cashierProfile.cashier.username 
                      : 'Loading...'}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    Cashier
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
        {/* Render the selected page */}
        {selected === "Home" && <Home />}
        {selected === "Orders" && <Orders />}
        {selected === "Profile" && <CashierProfile />}
      </nav>
      {/* Sidebar Menu */}
      <div
        id="drawer-navigation"
        className={`fixed z-50 top-0 left-0 w-64 h-screen p-4 overflow-y-auto transition-transform ${
          show ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl border-r-4 border-gray-600`}
        style={{ backgroundColor: "#3a6ddf" }}
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-white uppercase"
        >
          Menu
        </h5>
        <div className="mt-10 mb-4 flex justify-center">
          <img src={cashierProfile?.shop?.logo || Logo} alt="logo" className="w-20 h-20 rounded-full bg-white p-2" />
        </div>
        <div className="text-white text-center mb-6 font-medium">
          {cashierProfile?.cashier?.username || "Loading..."}
        </div>
        <button
          onClick={() => handleShow(!show)}
          type="button"
          className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5"
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
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-gray-900"
                onClick={() => {
                  setSelected("Home");
                  handleShow(false);
                }}
              >
                <svg
                  className="w-5 h-5 text-white transition duration-75"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ml-3">Home</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-gray-900"
                onClick={() => {
                  setSelected("Orders");
                  handleShow(false);
                }}
              >
                <svg
                  className="w-5 h-5 text-white transition duration-75"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span className="ml-3">Orders</span>
              </a>
            </li>

            {/* Additional Navigation Options */}
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  className="w-5 h-5 text-white transition duration-75"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="ml-3">Inbox</span>
                <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-yellow-800 bg-blue-100 rounded-full">
                  Coming soon
                </span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-gray-900"
                onClick={() => {
                  setSelected("Profile");
                  handleShow(false);
                }}
              >
                <BiUser className="w-5 h-5 text-white transition duration-75" />
                <span className="ml-3">Profile</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-gray-900"
                onClick={handleLogout}
              >
                <BiLogOut className="w-5 h-5 text-white transition duration-75" />
                <span className="ml-3">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboardLayout;
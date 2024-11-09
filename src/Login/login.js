import React, { useState } from "react";
import { BiWorld } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { FaGulp } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";

const options = [
  {
    icon: <HiUser size={50} color="#4084f4" />,
    label: "Admin",
    link: "/admin/login",
  },
  {
    icon: <FaUserTie size={50} color="#4084f4" />,
    label: "Manager",
    link: "/manager/login",
  },
  {
    icon: <HiOutlineShoppingCart size={50} color="#4084f4" />,
    label: "Cashier",
    link: "/cashier/login",
  },
  {
    icon: <FaGulp size={50} color="#4084f4" />,
    label: "Kitchen Staff",
    link: "/kitchen/login",
  },
];

const advantages = [
  {
    color: "#14914A",
    icon: <BiWorld size={30} />,
    title: "Manage your business from anywhere",
    description:
      "Nimbus is a cloud-based platform that allows you to manage your business from anywhere in the world.",
  },
  {
    color: "#4084F4",
    icon: <FaChartLine size={30} />,
    title: "Track your business performance",
    description:
      "Track your business performance with our easy to use dashboard.",
  },
  {
    color: "#368F8B",
    icon: <AiOutlineClockCircle size={30} />,
    title: "Get real-time updates",
    description:
      "Get real-time updates on your business performance with our easy to use dashboard.",
  },
];

const Login = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gray-100 w-full flex justify-between items-center p-4 sm:p-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Nimbus360 Solutions
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
        {/* Login Card */}
        <div className="w-full max-w-5xl bg-white p-6 sm:p-10 rounded-lg shadow-lg mt-4 sm:mt-10">
          <div className="mb-6 sm:mb-10 text-left">
            <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-5">
              Login to Nimbus<span style={{ color: "#4084F4" }}>360 </span>
              Solutions
            </h1>
            <p className="text-sm sm:text-md italic">
              Easy online order management for your business. Get started today!
            </p>
          </div>

          {/* Login Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {options.map((option, index) => (
              <button
                key={index}
                className="text-black bg-blue-100 py-4 px-4 rounded-lg border-none 
                          hover:bg-blue-200 hover:transform hover:scale-105 transition duration-400
                          flex flex-col justify-center items-center
                          h-40 sm:h-48"
                onClick={() => (window.location.href = option.link)}
              >
                <div className="flex flex-col justify-center items-center">
                  {React.cloneElement(option.icon, {
                    size: window.innerWidth < 640 ? 40 : 50
                  })}
                  <p className="text-md italic mt-4">{option.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advantages Section */}
        <div className="w-full max-w-5xl my-8 sm:my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {advantages.map((advantage, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              >
                <div
                  className="flex justify-center items-center text-white rounded-full w-16 h-16 mb-4"
                  style={{ backgroundColor: advantage.color }}
                >
                  {advantage.icon}
                </div>
                <h1 className="text-lg sm:text-xl font-semibold mb-2">
                  {advantage.title}
                </h1>
                <p className="text-gray-500 text-sm">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
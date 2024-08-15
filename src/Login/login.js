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
    icon: <HiUser size={50} />,
    label: "Admin",
    link: "/admin/login",
  },
  {
    icon: <FaUserTie size={50} />,
    label: "Manager",
    link: "/manager/login",
  },
  {
    icon: <HiOutlineShoppingCart size={50} />,
    label: "Cashier",
    link: "/cashier/login",
  },
  {
    icon: <FaGulp size={50} />,
    label: "Kitchen Staff",
    link: "/kitchenstaff/login",
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
      <div className="bg-gray-100 w-full flex justify-between items-center p-5">
        <h2 className="text-2xl font-semibold text-gray-900">
          Nimbus360 Solutions
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center bg-white p-10 rounded-lg shadow-lg mt-10 w-2/3">
          <div className="mt-10 mb-10 text-left">
            <h1 className="text-black text-2xl font-semibold mb-5">
              Login to Nimbus<span style={{ color: "#4084F4" }}>360 </span>
              Solutions
            </h1>
            <p className="text-black text-md italic">
              Easy online order management for your business. Get started today!
            </p>
          </div>
          <div className="flex flex-row justify-between w-full gap-2">
            {options.map((option) => (
              <button
                className="text-black bg-blue-200 py-2 px-4 rounded-lg border-none mb-3 w-1/4 h-48 hover:bg-blue-300 hover:transform hover:scale-105 transition duration-400"
                onClick={() => (window.location.href = option.link)}
              >
                <div className="flex flex-col justify-center items-center mb-2">
                  {option.icon}
                  <br></br>
                  <p className="text-md italic">{option.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className=" text-black bg-gray-100 shadow-lg flex flex-row items-center justify-center fixed bottom-0 w-full">
        {advantages.map((advantage) => (
          <div className="p-10 border-b flex flex-col items-center w-1/3">
            <div
              className={`flex justify-center items-center text-white rounded-full w-20 h-20 mb-5 `}
              style={{ backgroundColor: advantage.color }}
            >
              {advantage.icon}
            </div>
            <h1 className="text-left text-black text-2xl mb-2">
              {advantage.title}
            </h1>
            <p className="text-gray-500 text-sm text-center">
              {advantage.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;

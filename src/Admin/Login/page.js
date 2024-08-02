import React, { useState } from "react";
import { BiWorld } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import Logo from "../../Assets/Logo.png";
import Navbar from "../../Components/Navbar";
import AuthService from "../../Services/authService";

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
const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, password);

    AuthService.adminLogin(name, password).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="text-center flex flex-col  items-center justify-center">
      <Navbar />
      <div className="m-10 p-10 pt-2 w-1/3">
        <h1 className="text-2xl text-blue-500 mb-3">Admin Login</h1>

        <div className="flex flex-col justify-center gap-10">
          <div className="flex flex-col w-full">
            <h1 className="text-left text-black text-md">Username</h1>
            <input
              type="text"
              placeholder="Name"
              value={name}
              className="p-2 border border-gray-300 rounded-xl"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-left text-black text-md">Password</h1>
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="p-2 border border-gray-300 rounded-xl"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-10 w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <div className="flex justify-between mt-5 text-sm">
          <a href="#" className="text-blue-500">
            Forgot Password?
          </a>
          <a href="#" className="text-blue-500">
            Create Account
          </a>
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

export default AdminLogin;

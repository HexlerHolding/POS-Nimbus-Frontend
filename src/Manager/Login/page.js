import React, { useEffect, useState } from "react";
import { BiWorld } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import Logo from "../../Assets/Logo.png";
import Navbar from "../../Components/Navbar";
import AuthService from "../../Services/authService";
import useStore from "../../Store/store";

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
const ManagerLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");
  const [shopNames, setShopNames] = useState([]);
  const [shopName, setShopName] = useState("");
  const { setUserRole } = useStore();

  useEffect(() => {
    AuthService.getShopNames().then((res) => {
      setShopNames(res);
      console.log("ShopNames", shopNames);
    });
  }, []);

  const getBranches = () => {
    AuthService.getBranches(shopName).then((res) => {
      console.log("ShopName", shopName);
      console.log(res);
      setBranches(res);
    });
  };

  useEffect(() => {
    if (shopName === "") {
      setBranches([]);
    }
    if (shopName) {
      getBranches();
    }
  }, [shopName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, password);

    AuthService.managerLogin(name, password, shopName, branch).then((res) => {
      console.log(res);
      if (res === "error") {
        alert("Wrong Credentials");
      } else {
        alert("Login Successful");
        setUserRole(res.data.role);
        window.location.href = "/manager/dashboard";
      }
    });
  };

  return (
    <div className="text-center flex flex-col  items-center justify-center">
      <Navbar />
      <div className="m-10 p-10 pt-2 w-1/2">
        <h1 className="text-2xl text-blue-500 mb-3">Manager Login</h1>

        <div className="flex flex-col justify-center gap-10">
          <div className="flex flex-row w-full gap-4">
            <div className="flex flex-col w-1/2">
              <h1 className="text-left text-black text-md">Username</h1>
              <input
                type="text"
                placeholder="Name"
                value={name}
                className="p-2 border border-gray-300 rounded-xl"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-1/2">
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
        </div>
        <div className="flex flex-col justify-center mt-3">
          <div className="flex flex-col w-full">
            <h1 className="text-left text-black text-md">Shop Name</h1>
            <select
              className="p-2 border border-gray-300 rounded-xl"
              onChange={(e) => setShopName(e.target.value)}
            >
              <option value="">Select Shop</option>
              {shopNames &&
                shopNames.map((shop) => (
                  <option value={shop.shop_name}>{shop.shop_name}</option>
                ))}
            </select>
          </div>
          <div className="flex flex-col w-full mt-4">
            <h1 className="text-left text-black text-md">Branch</h1>
            <select
              className="p-2 border border-gray-300 rounded-xl"
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches &&
                branches.map((branch) => (
                  <option value={branch.branch_name}>
                    {branch.branch_name}
                  </option>
                ))}
            </select>
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

export default ManagerLogin;

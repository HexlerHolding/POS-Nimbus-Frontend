import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiWorld } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";
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

const KitchenLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");
  const [shopNames, setShopNames] = useState([]);
  const [shopName, setShopName] = useState("");
  const { setUserRole } = useStore();

  useEffect(() => {
    AuthService.getShopNames().then((res) => {
      // Ensure shopNames is always an array
      const shops = Array.isArray(res) ? res : res.data ? res.data : [];
      setShopNames(shops);
      console.log("ShopNames", shops);
    })
    .catch(error => {
      console.error("Error fetching shop names:", error);
      setShopNames([]);
    });
  }, []);

  const getBranches = () => {
    AuthService.getBranches(shopName).then((res) => {
      console.log("ShopName", shopName);
      console.log(res);
      // Ensure branches is always an array
      const branchList = Array.isArray(res) ? res : res.data ? res.data : [];
      setBranches(branchList);
    })
    .catch(error => {
      console.error("Error fetching branches:", error);
      setBranches([]);
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
    console.log(name, password, shopName, branch);

    AuthService.kitchenLogin(name, password, shopName, branch)
      .then((res) => {
        console.log(res);
        if (res === "error") {
          alert("Wrong Credentials");
        } else {
          alert("Login Successful");
          setUserRole(res.data.role);
          window.location.href = "/kitchen/orders";
        }
      })
      .catch(error => {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 mt-24">
        {/* Login Card */}
        <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-xl sm:text-2xl text-blue-500 mb-6 font-semibold text-center">
            Kitchen Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username and Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Shop and Branch Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="shop" className="block text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <select
                  id="shop"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Shop</option>
                  {shopNames && shopNames.length > 0 ? (
                    shopNames.map((shop, index) => (
                      <option key={index} value={shop.shop_name}>
                        {shop.shop_name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No shops available</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Branch</option>
                  {branches && branches.length > 0 ? (
                    branches.map((branch, index) => (
                      <option key={index} value={branch.branch_name}>
                        {branch.branch_name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No branches available</option>
                  )}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition duration-200"
            >
              Login
            </button>

            <div className="flex justify-start text-sm">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        {/* Advantages Section */}
        <div className="w-full max-w-6xl mt-12">
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
                <h2 className="text-lg font-semibold mb-2">
                  {advantage.title}
                </h2>
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

export default KitchenLogin;
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import {
  BiBuildingHouse,
  BiLock,
  BiStore,
  BiUser,
  BiWorld,
} from "react-icons/bi";
import { FaArrowRight, FaChartLine, FaSignInAlt } from "react-icons/fa";
import LogoWhite1 from "./Assets/LogoWhite1.png";
import loginimage from "./Assets/loginimage.png";
import AuthService from "./Services/authService";
import useStore from "./Store/store";

// Floating animation component
const FloatingElement = ({ children, delay, duration }) => {
  return (
    <div
      className="floating-element"
      style={{
        animation: `float ${duration || 4}s ease-in-out infinite ${
          delay || 0
        }s`,
      }}
    >
      {children}
    </div>
  );
};

const advantages = [
  {
    color: "#14914A",
    icon: <BiWorld size={30} />,
    title: "Manage your business from anywhere",
    description:
      "Nimbus is a cloud-based platform that allows you to manage your business from anywhere in the world.",
    delay: 0,
  },
  {
    color: "#4084F4",
    icon: <FaChartLine size={30} />,
    title: "Track your business performance",
    description:
      "Track your business performance with our easy-to-use dashboard.",
    delay: 0.3,
  },
  {
    color: "#368F8B",
    icon: <AiOutlineClockCircle size={30} />,
    title: "Get real-time updates",
    description:
      "Get real-time updates on your business performance with our easy-to-use dashboard.",
    delay: 0.6,
  },
];

const AllInOneLogin = () => {
  const [role, setRole] = useState(""); // To select the role (Admin, Cashier, Manager)
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [shopNames, setShopNames] = useState([]);
  const [branches, setBranches] = useState([]);
  const [shopName, setShopName] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const {
    setUserRole,
    setUserId,
    setShopId,
    setUserShopName,
    setBranchId,
    setBranchName,
  } = useStore();

  useEffect(() => {
    if (role === "Cashier" || role === "Manager" || role === "Kitchen") {
      setLoading(true);
      AuthService.getShopNames()
        .then((res) => setShopNames(res))
        .finally(() => setLoading(false));
    }
  }, [role]);

  useEffect(() => {
    if (shopName) {
      setLoading(true);
      AuthService.getBranches(shopName)
        .then((res) => setBranches(res))
        .finally(() => setLoading(false));
    } else {
      setBranches([]);
    }
  }, [shopName]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!role) {
      setError("Please select a role");
      return;
    }
    if (!name || !password) {
      setError("Username and password are required");
      return;
    }
    if ((role === "Cashier" || role === "Manager") && !shopName) {
      setError("Please select a shop");
      return;
    }
    if ((role === "Cashier" || role === "Manager") && !branch) {
      setError("Please select a branch");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (role === "Admin") {
        res = await AuthService.adminLogin(name, password);
        if (res === "error") {
          throw new Error("Invalid credentials");
        }
        setUserRole(res.data.role);
        setUserId(res.data.userId);
        setShopId(res.data.shopId);
        setUserShopName(name);
        showNotification("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else if (role === "Cashier") {
        res = await AuthService.cashierLogin(name, password, shopName, branch);
        if (res === "error") {
          throw new Error("Invalid credentials");
        }
        setUserRole(res.data.role);
        setUserId(res.data.userId);
        setShopId(res.data.shopId);
        setUserShopName(shopName);
        setBranchId(res.data.branchId);
        setBranchName(branch);
        showNotification("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/cashier/dashboard";
        }, 1500);
      } else if (role === "Manager") {
        res = await AuthService.managerLogin(name, password, shopName, branch);
        if (res === "error") {
          throw new Error("Invalid credentials");
        }
      
        setUserRole(res.data.role);
        setUserId(res.data.userId);
        setShopId(res.data.shopId);
        setUserShopName(shopName);
        setBranchId(res.data.branchId);
        setBranchName(branch);
        showNotification("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/manager/dashboard";
        }, 1500);
      } else if (role === "Kitchen") {
        res = await AuthService.kitchenLogin(name, password, shopName, branch);
        if (res === "error") {
          throw new Error("Invalid credentials");
        }
        setUserRole(res.data.role);
        setUserId(res.data.userId);
        setShopId(res.data.shopId);
        setUserShopName(shopName);
        setBranchId(res.data.branchId);
        setBranchName(branch);
        showNotification("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/kitchen/orders";
        }, 1500);
      }
      
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
      showNotification("Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Role card component
  const RoleCard = ({ title, icon, isSelected, onClick }) => (
    <div
      className={`flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 rounded-xl ${
        isSelected
          ? "bg-blue-900 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      <div className={`text-3xl mb-2 ${isSelected ? "text-green-400" : ""}`}>
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );

  // CSS Styles for animations
  const styles = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    .floating-element {
      animation: float 4s ease-in-out infinite;
    }
    @keyframes slideIn {
      0% { transform: translateX(20px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center">
      <style>{styles}</style>
    

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 py-3 px-6 rounded-lg shadow-lg slide-in flex items-center ${
            notification.type === "success"
              ? "bg-green-400 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="container mx-auto pt-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden ">
          {/* Left side - Image and advantages */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 p-10 text-white relative max-sm:hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 opacity-10">
              <FloatingElement delay={0} duration={4}>
                <BiWorld className="text-7xl" />
              </FloatingElement>
            </div>
            <div className="absolute bottom-20 right-10 opacity-10">
              <FloatingElement delay={0.5} duration={5}>
                <AiOutlineClockCircle className="text-6xl" />
              </FloatingElement>
            </div>

            <div className="mb-12 relative z-10">
              <div className="flex items-center mb-4">
                <img src={LogoWhite1} alt="Logo" className="w-12 h-12 mr-3" />
                <h1 className="text-3xl font-bold">
                  Nimbus<span className="text-green-400">360</span>
                </h1>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
              <p className="text-gray-300">
                Log in to access your dashboard and manage your business.
              </p>
            </div>

            <div className="mt-8 mb-4 relative z-10">
              <h3 className="text-xl font-semibold mb-6">Advantages</h3>

              <div className="space-y-6">
                {advantages.map((advantage, index) => (
                  <div
                    key={index}
                    className="flex slide-in"
                    style={{ animationDelay: `${advantage.delay}s` }}
                  >
                    <div
                      className="p-3 rounded-xl mr-4"
                      style={{ backgroundColor: advantage.color }}
                    >
                      {advantage.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{advantage.title}</h4>
                      <p className="text-sm text-gray-300">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background image */}
            <div className="absolute bottom-0 right-0 w-full  opacity-10">
              <img
                src={loginimage}
                alt="Login"
                className="w-full h-full object-cover object-right-bottom"
              />
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="lg:w-1/2 p-10">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Sign In</h2>
              <p className="text-gray-600 mb-8">
                Nice to see you again. Please log in to continue.
              </p>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}

              {/* Role Selection */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <RoleCard
                    title="Admin"
                    icon={<BiUser />}
                    isSelected={role === "Admin"}
                    onClick={() => setRole("Admin")}
                  />
                  <RoleCard
                    title="Cashier"
                    icon={<FaSignInAlt />}
                    isSelected={role === "Cashier"}
                    onClick={() => setRole("Cashier")}
                  />
                  <RoleCard
                    title="Manager"
                    icon={<FaChartLine />}
                    isSelected={role === "Manager"}
                    onClick={() => setRole("Manager")}
                  />
                  <RoleCard
                    title="Kitchen Staff"
                    icon={<FaChartLine />}
                    isSelected={role === "Kitchen"}
                    onClick={() => setRole("Kitchen")}
                  />
                </div>
              </div>

              {role && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BiUser className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter Username"
                          value={name}
                          className="py-3 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BiLock className="text-gray-500" />
                        </div>
                        <input
                          type="password"
                          placeholder="Enter Password"
                          value={password}
                          className="py-3 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {(role === "Cashier" || role === "Manager" || role === "Kitchen") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Shop Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiStore className="text-gray-500" />
                          </div>
                          <select
                            className="py-3 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none bg-white transition-all"
                            onChange={(e) => setShopName(e.target.value)}
                            value={shopName}
                          >
                            <option value="">Select Shop</option>
                            {shopNames.map((shop) => (
                              <option
                                key={shop.shop_name}
                                value={shop.shop_name}
                              >
                                {shop.shop_name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Branch
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiBuildingHouse className="text-gray-500" />
                          </div>
                          <select
                            className="py-3 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none bg-white transition-all"
                            onChange={(e) => setBranch(e.target.value)}
                            value={branch}
                            disabled={!shopName || branches.length === 0}
                          >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                              <option
                                key={branch.branch_name}
                                value={branch.branch_name}
                              >
                                {branch.branch_name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <a
                      href="#"
                      className="text-sm font-medium text-blue-900 hover:text-green-400 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg font-medium text-white ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                    } transition-colors`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Sign In <FaArrowRight className="ml-2" />
                      </>
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="font-medium text-blue-900 hover:text-green-400 transition-colors"
                      >
                        Contact Admin
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInOneLogin;

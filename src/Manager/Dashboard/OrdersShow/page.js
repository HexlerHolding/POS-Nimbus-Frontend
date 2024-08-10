import React, { useState, useEffect } from "react";
import { BiSolidSleepy } from "react-icons/bi";
import cashierService from "../../../Services/cashierService";
import commonService from "../../../Services/common";
const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [activeOption, setActiveOption] = useState("All Orders");
  const [filteredOrders, setFilteredOrders] = useState(data);

  const [card_tax, setCard_tax] = useState(0);
  const [cash_tax, setCash_tax] = useState(0);

  useEffect(() => {
    try {
      //get taxes for card and cash from backend
      cashierService.getTaxes().then((response) => {
        if (response.data) {
          setCard_tax(response.data.card_tax);
          setCash_tax(response.data.cash_tax);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [order_id, setOrder_id] = useState("");
  const [customer_name, setCustomer_name] = useState("");
  const [time, setTime] = useState("");
  const [total, setTotal] = useState("");
  const [payment_method, setPayment_method] = useState("");
  const [status, setstatus] = useState("");

  const getOrders = async () => {
    const response = await cashierService.getOrders();
    if (response.data) {
      setData(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const [paymentMethods, setPaymentMethods] = useState(["cash", "card"]);

  const [orderStatus, setOrderStatus] = useState([
    "pending",
    "completed",
    "ready",
    
  ]);

  useEffect(() => {
    if (activeOption === "All Orders") {
      setFilteredOrders(data);
    } else if (activeOption === "Pending Orders") {
      setFilteredOrders(data.filter((order) => order.status === "pending"));
    } else if (activeOption === "Completed Orders") {
      setFilteredOrders(data.filter((order) => order.status === "completed"));
    } else if (activeOption === "Ready Orders") {
      setFilteredOrders(data.filter((order) => order.status === "ready"));
    }
  }, [activeOption]);

  const handleFilter = () => {
    setLoading(true);
    let filteredData = data;
    if (order_id) {
      filteredData = filteredData.filter(
        (order) => order.order_id === order_id
      );
    }
    if (customer_name) {
      filteredData = filteredData.filter(
        (order) => order.customer_name === customer_name
      );
    }
    if (time) {
      filteredData = filteredData.filter((order) => order.time === time);
    }
    if (total) {
      filteredData = filteredData.filter((order) => order.total === total);
    }
    if (payment_method) {
      filteredData = filteredData.filter(
        (order) => order.payment_method === payment_method
      );
    }
    if (status) {
      filteredData = filteredData.filter((order) => order.status === status);
    }
    setFilteredOrders(filteredData);
    console.log(filteredData);
    setLoading(false);
  };

  const handleReset = () => {
    setOrder_id("");
    setCustomer_name("");
    setTime("");
    setTotal("");
    setPayment_method("");
    setstatus("");
    setActiveOption("All Orders");
    setFilteredOrders(data);
  };

  return (
    <div className="p-5">
      {loading ? (
        <div className="flex justify-center items-center fixed bg-white bg-opacity-50 top-0 left-0 w-full h-full z-50">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      <div>
        <h1 className="text-2xl text-blue-500 mb-2">Orders</h1>
        <div className="gap-5">
          <h1 className="text-xl text-gray-500 mb-2">Filters</h1>
          <div className="flex gap-5">
            <div className="relative z-0 mb-5 group w-1/3">
              <input
                type="text"
                name="order_id"
                id="order_id"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) => setOrder_id(e.target.value)}
              />
              <label
                for="order_id"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Order ID
              </label>
            </div>
            <div className="relative z-0 mb-5 group w-1/3">
              <input
                type="text"
                name="customer_name"
                id="customer_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) => setCustomer_name(e.target.value)}
              />
              <label
                for="customer_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Customer Name
              </label>
            </div>
            <div className="relative z-0 mb-5 group w-1/3">
              <input
                type="text"
                name="time"
                id="time"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) => setTime(e.target.value)}
              />
              <label
                for="time"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Time
              </label>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="relative z-0 mb-5 group w-1/3">
              <input
                type="text"
                name="total"
                id="total"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) => setTotal(e.target.value)}
              />
              <label
                for="total"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Total
              </label>
            </div>
            <div className="relative z-0 mb-5 group w-1/3">
              <select
                name="payment_method"
                id="payment_method"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={(e) => setPayment_method(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <label
                for="payment_method"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Payment Method
              </label>
            </div>
            <div className="relative z-0 mb-5 group w-1/3">
              <select
                name="status"
                id="status"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={(e) => setstatus(e.target.value)}
              >
                <option value="">Select Order Status</option>
                {orderStatus.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <label
                for="status"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Order Status
              </label>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <button
              className=" text-black underline rounded-lg mb-5 focus:outline-none"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded-lg w-full mb-10"
            onClick={handleFilter}
          >
            Search
          </button>
        </div>
        <div className="flex gap-5">
          <button
            className={`${
              activeOption === "All Orders" ? "bg-green-500" : "bg-gray-800"
            } text-white px-5 py-2 rounded-lg`}
            onClick={() => setActiveOption("All Orders")}
          >
            All Orders
          </button>
          <button
            className={`${
              activeOption === "Pending Orders" ? "bg-green-500" : "bg-gray-800"
            } text-white px-5 py-2 rounded-lg`}
            onClick={() => setActiveOption("Pending Orders")}
          >
            Pending Orders
          </button>
          <button
            className={`${
              activeOption === "Completed Orders"
                ? "bg-green-500"
                : "bg-gray-800"
            } text-white px-5 py-2 rounded-lg`}
            onClick={() => setActiveOption("Completed Orders")}
          >
            Completed Orders
          </button>
          <button
            className={`${
              activeOption === "Ready Orders" ? "bg-green-500" : "bg-gray-800"
            } text-white px-5 py-2 rounded-lg`}
            onClick={() => setActiveOption("Ready Orders")}
          >
            Ready Orders
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
        {filteredOrders.length === 0 && (
          <div className="min-h-96 flex flex-col items-center justify-center col-span-3">
            <BiSolidSleepy className="text-5xl text-gray-300" />
            <p className="text-xl text-gray-500">No Orders Found</p>
          </div>
        )}
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="relative w-full p-5 rounded-lg items-center gap-5 h-96 justify-between card border-dashed border-2 border-gray-300 cursor-default"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xl mb-10">
                  Order ID: {commonService.handleCode(order._id)}
                </p>
                <p
                  className={`text-md mb-10 border-2 px-2 rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : order.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <p className="text-md mb-10">
                Customer Name: {order.customer_name}
              </p>
              <p className="text-md mb-10">
                Order Date: {order.time.split("T")[0]}
              </p>
              <p className="text-md mb-10">
                Order Time: {order.time.split("T")[1].split("Z")[0]}
              </p>
              <div className="w-full border-t-2 flex items-center p-2">
                <div>
                  <p className="text-md">Total Amount: {order.total} /-</p>
                </div>
                <p className="text-md ml-auto">Tax: {order.tax} %</p>
              </div>
              <div className="w-full border-t-2 flex items-center p-2">
                <p className="text-md p-2">
                  Grand Total: {(order.total + order.tax).toFixed(2)} /-
                </p>
                {order.status === "Pending" && (
                  <button className="text-blue-500 underline rounded-lg ml-auto">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

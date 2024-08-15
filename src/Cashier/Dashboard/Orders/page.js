import React, { useState, useEffect } from "react";
import { BiSolidSleepy } from "react-icons/bi";
import cashierService from "../../../Services/cashierService";
import commonService from "../../../Services/common";
const Orders = () => {
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
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const [paymentMethods, setPaymentMethods] = useState(["cash", "card"]);

  const [orderStatus, setOrderStatus] = useState([
    "pending",
    "ready",
    "completed",
    "cancelled",
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
    } else if (activeOption === "Cancelled Orders") {
      setFilteredOrders(data.filter((order) => order.status === "cancelled"));
    }
  }, [activeOption]);

  const handleFilter = () => {
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

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await cashierService.markOrderCancelled(orderId);
      if (response.data) {
        console.log(response.data);
        getOrders();
      }
      alert("Order Cancelled Successfully");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-5">
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
              activeOption === "Ready Orders" ? "bg-green-500" : "bg-gray-800"
            } text-white px-5 py-2 rounded-lg`}
            onClick={() => setActiveOption("Ready Orders")}
          >
            Ready Orders
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
              activeOption === "Cancelled Orders"
                ? "bg-green-500"
                : "bg-gray-800"
            } text-white px-5 py-2 rounded-lg`}
            onClick={() => setActiveOption("Cancelled Orders")}
          >
            Cancelled Orders
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
            className="relative w-full p-5 rounded-lg items-center gap-5 h-auto justify-between card border-dashed border-2 border-gray-300 cursor-default"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xl mb-10">
                  Order ID: {commonService.handleCode(order._id)}
                </p>
                <p
                  className={`text-md mb-10 border-2 px-2 rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : order.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : order.status === "cancelled"
                      ? "bg-red-200 text-red-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <div className="flex text-md mb-5">
                Customer Name:&nbsp;
                <p className="font-semibold">{order.customer_name}</p>
              </div>
              <div className="flex text-md mb-5">
                Order Date:&nbsp;
                <p className="font-semibold">{order.time.split("T")[0]}</p>
              </div>
              <div className="flex text-md mb-5">
                Order Time:&nbsp;
                <p className="font-semibold">
                  {order.time.split("T")[1].split("Z")[0]}
                </p>
              </div>
              <div className="w-full border-t-2 flex items-center p-2">
                <div>
                  <p className="text-md">Total Amount: {order.total} /-</p>
                </div>
                <p className="text-sm ml-auto">Discount: {order.discount}%</p>
                <p className="text-sm ml-auto">Tax: {order.tax}%</p>
              </div>
              <div className="w-full border-t-2 flex items-center p-2">
                <p className="text-md p-2">
                  Grand Total:{" "}
                  {order.grand_total} /-
                </p>
                {order.status === "pending" && (
                  <button
                    className="text-blue-500 underline rounded-lg ml-auto"
                    onClick={() => handleCancelOrder(order._id)}
                  >
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

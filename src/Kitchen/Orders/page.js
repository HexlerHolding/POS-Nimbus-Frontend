import React, { useState, useEffect } from "react";
import { BiSolidSleepy } from "react-icons/bi";
import CashierService from "../../Services/cashierService";
import CommonService from "../../Services/common";

const Orders = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [timeLeft, setTimeLeft] = useState([]);

  const fetchOrders = async () => {
    const response = await CashierService.getPendingOrders();
    if (response.data) {
      setFilteredOrders(response.data);
      setTimeLeft(response.data.map(() => 180));
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft.map((time) => time - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getBackgroundColor = (time) => {
    if (time > 120) {
      return "bg-green-200";
    } else if (time > 60) {
      return "bg-yellow-200";
    } else if (time > 0) {
      return "bg-red-400";
    } else {
      return "bg-red-600";
    }
  };

  //const remove order from filteredOrders and timeLeft
  const removeOrder = (index, orderId) => {
    try {
      const res = CashierService.markOrderReady(orderId);
      if (res.error) {
        console.error(res.error);
        return;
      }
      console.log(res.data);

      setTimeLeft((prevTimeLeft) => prevTimeLeft.filter((_, i) => i !== index));

      setFilteredOrders((prevFilteredOrders) =>
        prevFilteredOrders.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (time) => {
    const absTime = Math.abs(time);
    const minutes = Math.floor(absTime / 60);
    const seconds = absTime % 60;
    return `${time < 0 ? "+" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div className="p-5">
      <div>
        <h1 className="text-2xl text-blue-500 mb-2 font-semibold">Orders</h1>
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
            className={`relative w-full rounded-lg items-center gap-5 h-96 justify-between card border-dashed border-2 border-gray-300 cursor-pointer 
              ${getBackgroundColor(timeLeft[index])}`}
            onClick={() => removeOrder(index, order._id)}
          >
            <div>
              <div className="flex items-center justify-between p-5 pb-2">
                <p className="text-2xl font-semibold">
                  Order ID: {CommonService.handleID(order._id)}
                </p>
                <p className="text-md font-semibold">
                  Customer Name: {order.customer_name}
                </p>
              </div>
              {order.cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 pt-2 pb-0"
                >
                  <p className="text-xl">
                    {item.product_name} x{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                </div>
              ))}
              <div className="absolute bottom-0 justify-between border-t-2 flex items-center p-2 w-full">
                <p className="text-xl p-2 font-light">
                  Grand Total: {(order.total + order.tax).toFixed(2)} /-
                </p>
                <p
                  className={`text-2xl p-2 font-semibold ${getBackgroundColor(
                    timeLeft[index]
                  )}`}
                >
                  Time Left: {formatTime(timeLeft[index])}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

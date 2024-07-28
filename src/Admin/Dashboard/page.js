import React, { useState, useEffect } from "react";
import Logo from "../../Assets/Logo.png";
import Line from "./Charts/line";
import ExpenseChart from "./Charts/expenseChart";
import Donut from "./Charts/donut";
import Chart from "./Charts/chart";

const Dashboard = () => {
  return (
    <div className="flex flex-col">
     
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5 gap-5">
          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#2c302c" }}
          >
            <div>
              <p className="text-white text-lg mb-3">Total Customers</p>
              <p className="text-5xl text-white font-semibold">200,923</p>
            </div>
          </div>
          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#383F51" }}
          >
            <div>
              <p className="text-white text-lg mb-3">Total Inventory</p>
              <p className="text-5xl text-white font-semibold ">100,321</p>
            </div>
          </div>

          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#368F8B" }}
          >
            <div>
              <p className="text-white text-lg mb-3">Total Sales</p>
              <p className="text-5xl text-white font-semibold">$1,000,000</p>
            </div>
          </div>
          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#1f2937" }}
          >
            <div>
              <p className="text-white text-lg mb-3">Number of Products</p>
              <p className="text-5xl text-white font-semibold">223</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row p-5 gap-5">
        <Line />
        <Chart />
        <ExpenseChart />
        <Donut />
      </div>
    </div>
  );
};

export default Dashboard;

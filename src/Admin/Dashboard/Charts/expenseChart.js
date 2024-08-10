import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import AdminService from "../../../Services/adminService";

const ExpenseChart = () => {
  const [branches, setBranches] = useState([]);
  const [totalCash, setTotalCash] = useState(0);

  const calculateCashOnHand = () => {
    let total = 0;
    branches.map((branch) => {
      total += branch.cash_on_hand;
    });
    setTotalCash(total);
  };

  useEffect(() => {
    calculateCashOnHand();
  }, [branches]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getBranches();
      if (response.error) {
        console.log(response.error);
      } else {
        setBranches(response.data);
        console.log("branches", response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div class="w-1/4 bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div class="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
        <dl>
          <dt class="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
            Total Cash in Hand
          </dt>
          <dd class="leading-none text-3xl font-bold text-gray-900 dark:text-white">
            {totalCash}
          </dd>
        </dl>
      </div>
      <div className="table w-full mt-4">
        <div className="table-row-group">
          <div className="table-row text-gray-200">
            <div className="table-cell font-bold">Branch</div>
            <div className="table-cell font-bold text-right">Cash in Hand</div>
          </div>
          <div className=" mt-2"></div>
          {branches.map((branch) => (
            <div className="table-row text-gray-300">
              <div className="table-cell">{branch.branch_name}</div>
              <div className="table-cell text-right">{branch.cash_on_hand}</div>
            </div>
          ))}
        </div>
      </div>

      <div class="grid grid-cols-2 py-3"></div>
    </div>
  );
};

export default ExpenseChart;

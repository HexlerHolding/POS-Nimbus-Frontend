import React, { useState, useEffect } from "react";
import managerService from "../../Services/managerService";
import commonService from "../../Services/common";
const CashierViews = () => {
  const [cashiers, setCashiers] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [submitPressed, setSubmitPressed] = useState(false);

  const fetchCashiers = async () => {
    const response = await managerService.getCashiers();

    setSubmitPressed(!submitPressed);
    console.log(response);
    if (response.data) {
      setCashiers(response.data.cashiers);
      setBranchName(response.data.branchName);
    }
  };

  useEffect(() => {
    fetchCashiers();
  }, []);

  return (
    <div class="relative overflow-x-auto p-10 mt-10 min-h-screen">
      <h1 class="text-2xl text-blue-500 mb-2">View Cashiers</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-10">
        View all cashiers in a branch
      </p>

      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Cashier ID
            </th>
            <th scope="col" class="px-6 py-3">
              Cashier Name
            </th>
            <th scope="col" class="px-6 py-3">
              Branch Name
            </th>
            <th scope="col" class="px-6 py-3">
              Joining Date
            </th>
            <th scope="col" class="px-6 py-3">
              Salary
            </th>
          </tr>
        </thead>
        <tbody class="bg-gray-800 divide-y dark:divide-gray-700">
          {cashiers.map((cashier) => (
            <tr key={cashier._id}>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-200">
                      {commonService.handleID(cashier._id)}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{cashier.username}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{branchName}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">
                  {cashier.joining_date.split("T")[0]}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">Feature Coming Soon</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashierViews;

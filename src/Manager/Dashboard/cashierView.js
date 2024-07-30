import React, { useState, useEffect } from "react";

const data = [
  {
    id: 1,
    username: "cashier1",
    password: "cashier1",
    branch: "branch1",
    joining_date: "2021-10-10",
  },
  {
    id: 2,
    username: "cashier2",
    password: "cashier2",
    branch: "branch2",
    joining_date: "2021-10-10",
  },
  {
    id: 3,
    username: "cashier3",
    password: "cashier3",
    branch: "branch3",
    joining_date: "2021-10-10",
  },
];

const CashierViews = () => {
  const [cashiers, setCashiers] = useState(data);

  useEffect(() => {
    console.log("Component Mounted");
    return () => {
      console.log("Component Unmounted");
    };
  }, []);

  return (
    <div class="relative overflow-x-auto p-10 m-10 min-h-screen">
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
            <tr key={cashier.id}>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-200">
                      {cashier.id}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{cashier.username}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{cashier.branch}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{cashier.joining_date}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">Coming Soon</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashierViews;

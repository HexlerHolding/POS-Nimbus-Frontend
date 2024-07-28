import React, { useState, useEffect } from "react";
import Managers from "./data";

const ManagerView = () => {
  const [branches, setBranches] = useState([
    "Branch 1",
    "Branch 2",
    "Branch 3",
  ]);

  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");

  useEffect(() => {
    if (selectedBranch === "all") {
      setSelectedManagers(Managers);
      return;
    }
    setSelectedManagers(
      Managers.filter((manager) => manager.branch_name === selectedBranch)
    );
  }, [selectedBranch]);

  return (
    <div class="relative overflow-x-auto p-20 min-h-screen">
      <h1 class="text-2xl text-blue-500 mb-2">View Managers</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-10">
        View all managers in a branch
      </p>
      <div class="relative z-0 w-full mb-10 group mt-2">
        <select
          onChange={(e) => setSelectedBranch(e.target.value)}
          class="block py-2.5 px-2 mt-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        >
          <option value="none" selected disabled hidden>
            Select Branch
          </option>
          <option value="all">All</option>

          {branches.map((branch) => (
            <option value={branch}>{branch}</option>
          ))}
        </select>
        <label
          for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Branch
        </label>
      </div>

      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Manager ID
            </th>
            <th scope="col" class="px-6 py-3">
              Manager Name
            </th>
            <th scope="col" class="px-6 py-3">
              Branch Name
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedManagers.map((manager) => (
            <tr class="bg-white dark:bg-gray-800" key={manager.id}>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-400">
                      {manager.id}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-gray-200">
                  {manager.username}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {manager.branch_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerView;

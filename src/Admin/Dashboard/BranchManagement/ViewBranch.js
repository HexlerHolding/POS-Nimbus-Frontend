import React, { useState, useEffect } from "react";

const ViewBranches = ({ branches }) => {
  //table for displaying branches
  return (
    <div class="relative overflow-x-auto p-20 min-h-screen">
      <h1 class="text-2xl text-blue-500 mb-2">View Branches</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-10">View all branches</p>
      <div class="relative z-0 w-full mb-10 group mt-2">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">
                Branch Name
              </th>
              <th scope="col" class="px-6 py-3">
                Branch Address
              </th>
              <th scope="col" class="px-6 py-3">
                Branch Phone
              </th>
              <th scope="col" class="px-6 py-3">
                Shift Status
              </th>
              <th scope="col" class="px-6 py-3">
                Opening Time
              </th>
              <th scope="col" class="px-6 py-3">
                Closing Time
              </th>
              <th scope="col" class="px-6 py-3">
                Branch Sales
              </th>
              <th scope="col" class="px-6 py-3">
                Branch Cash in Hand
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr class="bg-gray-50 dark:bg-gray-700 text-black dark:text-gray-200">
                <td class="px-6 py-4">{branch.branch_name}</td>
                <td class="px-6 py-4">{branch.address}</td>
                <td class="px-6 py-4">{branch.contact}</td>
                <td class="px-6 py-4">{branch.shift_status ? "Open" : "Closed"}</td>
                <td class="px-6 py-4">{branch.opening_time}</td>
                <td class="px-6 py-4">{branch.closing_time}</td>
                <td class="px-6 py-4">{branch.branch_sales}/-</td>
                <td class="px-6 py-4">{branch.cash_on_hand}/-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewBranches;

import React, { useState, useEffect } from "react";
import managerService from "../../../Services/managerService";
import commonService from "../../../Services/common";
const ViewKitchenStaff = () => {
  const [kitchenStaff, setKitchenStaff] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [submitPressed, setSubmitPressed] = useState(false);

  const fetchKitchenStaff = async () => {
    const response = await managerService.getKitchenStaff();

    setSubmitPressed(!submitPressed);
    console.log(response);
    if (response.data) {
      setKitchenStaff(response.data.kitchens);
      setBranchName(response.data.branchName);
    }
  };

  useEffect(() => {
    fetchKitchenStaff();
  }, []);

  return (
    <div class="relative p-10 mt-10 min-h-screen">
      <h1 class="text-2xl text-blue-500 mb-2">View Kitchen Staff</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-10">
        View all kitchen staff in a branch
      </p>

      <div className="overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Staff ID
              </th>
              <th scope="col" class="px-6 py-3">
                Staff Name
              </th>
              <th scope="col" class="px-6 py-3">
                Branch Name
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y dark:divide-gray-700">
            {kitchenStaff.map((staff) => (
              <tr key={staff._id}>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-200">
                        {commonService.handleID(staff._id)}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{staff.username}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{branchName}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewKitchenStaff;

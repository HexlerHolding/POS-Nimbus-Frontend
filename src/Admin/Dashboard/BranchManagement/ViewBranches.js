import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import ViewBranches from "./ViewBranch";
import BranchAdd from "./branchAdd";
import data from "./data";

const BranchPage = () => {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    setBranches(data);
  }, []);
  const [activeOption, setActiveOption] = useState("add");
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-5 w-full justify-center">
        <button
          onClick={() => setActiveOption("add")}
          className={`${
            activeOption === "add"
              ? "bg-blue-500 text-white focus:outline-none"
              : "bg-white text-black"
          } p-3 rounded-lg`}
        >
          Add Branch
        </button>
        <button
          onClick={() => setActiveOption("view")}
          className={`${
            activeOption === "view"
              ? "bg-blue-500 text-white focus:outline-none"
              : "bg-white text-black"
          } p-3 rounded-lg`}
        >
          View Branches
        </button>
      </div>
      {activeOption === "add" && <BranchAdd />}
      {activeOption === "view" && <ViewBranches branches={branches} />}
    </div>
  );
};

export default BranchPage;

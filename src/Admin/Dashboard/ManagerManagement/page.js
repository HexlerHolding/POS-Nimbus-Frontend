import React, { useState } from "react";
import ManagerAdd from "./managerAdd";
import ManagerView from "./managerView";

const ManagerManagement = () => {
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
          Add Manager
        </button>
        <button
          onClick={() => setActiveOption("view")}
          className={`${
            activeOption === "view"
              ? "bg-blue-500 text-white focus:outline-none"
              : "bg-white text-black"
          } p-3 rounded-lg`}
        >
          View Managers
        </button>
      </div>
      {activeOption === "add" && <ManagerAdd />}
      {activeOption === "view" && <ManagerView />}
    </div>
  );
};

export default ManagerManagement;

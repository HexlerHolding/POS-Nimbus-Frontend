import React, { useState } from "react";
import AddProduct from "./AddProduct";
import ViewProducts from "./ViewProducts";

const ProductPage = () => {
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
          Add Product
        </button>
        <button
          onClick={() => setActiveOption("view")}
          className={`${
            activeOption === "view"
              ? "bg-blue-500 text-white focus:outline-none"
              : "bg-white text-black"
          } p-3 rounded-lg`}
        >
          View Products
        </button>
      </div>
      {activeOption === "add" && <AddProduct />}
      {activeOption === "view" && <ViewProducts />}
    </div>
  );
};

export default ProductPage;

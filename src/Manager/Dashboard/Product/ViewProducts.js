import React, { useState, useEffect } from "react";
import product from "../../../Assets/product.jpg";
import ManagerService from "../../../Services/managerService";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ManagerService.getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.data);
        setProducts(data.data.products);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
      {products.map((product, index) => (
        <div
          key={index}
          className="relative w-full p-5 rounded-lg shadow-md items-center gap-5 h-96 justify-between card"
          style={{ background: "#2c302c" }}
        >
          <div>
            <img
              src={product.image}
              alt="product"
              className="w-full h-36 object-cover rounded-xl mb-3"
            />
            <p className="text-white text-xl mb-10">{product.name}</p>
            <p className="text-gray-300 text-sm mb-3">{product.description}</p>
            <p className="text-gray-300 text-sm mb-3">
              {product.category_name}
            </p>
            <p className="text-gray-300 text-2xl mb-3">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewProducts;

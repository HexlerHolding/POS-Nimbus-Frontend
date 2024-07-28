import React, { useState } from "react";
import product from "../../../Assets/product.jpg";

const data = [
  {
    product_name: "Product 1",
    product_image: product,
    product_description: "Product 1 Description",
    category: "Category 1",
    product_price: 100,
  },
  {
    product_name: "Product 2",
    product_image: product,
    product_description: "Product 2 Description",
    category: "Category 2",
    product_price: 200,
  },
  {
    product_name: "Product 3",
    product_image: product,
    product_description: "Product 3 Description",
    category: "Category 3",
    product_price: 300,
  },
  {
    product_name: "Product 4",
    product_image: product,
    product_description: "Product 4 Description",
    category: "Category 4",
    product_price: 400,
  },
  {
    product_name: "Product 5",
    product_image: product,
    product_description: "Product 5 Description",
    category: "Category 5",
    product_price: 500,
  },
];

const ViewProducts = () => {
  const [products, setProducts] = useState(data);
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
              src={product.product_image}
              alt="product"
              className="w-full h-36 object-cover rounded-xl mb-3"
            />
            <p className="text-white text-xl mb-10">{product.product_name}</p>
            <p className="text-gray-300 text-sm mb-3">
              {product.product_description}
            </p>
            <p className="text-gray-300 text-sm mb-3">{product.category}</p>
            <p className="text-gray-300 text-2xl mb-3">${product.product_price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewProducts;

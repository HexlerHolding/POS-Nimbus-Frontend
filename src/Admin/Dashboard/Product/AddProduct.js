import axios from "axios"; // Import axios to manually add category if needed
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi"; // Import dropdown icon
import AdminService from "../../../Services/adminService";
import ManagerService from "../../../Services/managerService";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  
  // New state for adding a new category
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [error, setError] = useState("");

  const clearForm = () => {
    setName("");
    setImage("");
    setDescription("");
    setCategory("");
    setPrice("");
  };

  const fetchCategories = () => {
    setError("");
    ManagerService.getCategories().then((data) => {
      if (data.error) {
        console.log("Error fetching categories:", data.error);
        setError("Failed to load categories: " + data.error);
      } else {
        console.log("Categories loaded:", data.data);
        setCategories(Array.isArray(data.data) ? data.data : []);
      }
    }).catch(err => {
      console.error("Exception fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    console.log(name, image, description, category, price);
    if (!name || !image || !description || !category || !price) {
      setError("Please fill all the fields");
      return;
    }

    var formData = new FormData();

    formData.append("name", name);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    ManagerService.addProduct(formData).then((data) => {
      if (data.error) {
        console.log("Error adding product:", data.error);
        setError("Failed to add product: " + data.error);
        return;
      } else {
        console.log("Product added successfully:", data.data);
        alert("Product added successfully!");
      }

      clearForm();
    }).catch(err => {
      console.error("Exception adding product:", err);
      setError("Failed to add product. Please try again.");
    });
  };

  const toggleNewCategoryInput = () => {
    console.log("Toggling new category input. Current state:", showNewCategoryInput);
    setShowNewCategoryInput(!showNewCategoryInput);
    if (!showNewCategoryInput) {
      setTimeout(() => {
        const input = document.getElementById("new_category");
        if (input) input.focus();
      }, 100);
    }
  };

  // Try to get shopId from JWT token
  const getShopIdFromToken = async () => {
    try {
      // Make a simple request to get shop info which should contain shopId
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin`, {
        withCredentials: true
      });
      if (response.data && response.data[0] && response.data[0]._id) {
        return response.data[0]._id;
      }
      return null;
    } catch (error) {
      console.error("Error getting shopId from token:", error);
      return null;
    }
  };

  const handleAddCategory = async () => {
    setError("");
    if (!newCategoryName.trim()) {
      setError("Please enter a category name");
      return;
    }

    setAddingCategory(true);
    console.log("Adding new category:", newCategoryName);

    try {
      // First try the standard way
      const result = await AdminService.addCategory({
        categoryName: newCategoryName
      });

      // If we get shop_id error, try with explicit shopId
      if (result.error && result.error.includes("shop_id")) {
        console.log("Trying to add category with explicit shopId");
        
        // Get shopId from token
        const shopId = await getShopIdFromToken();
        
        if (!shopId) {
          throw new Error("Could not retrieve shop ID");
        }
        
        // Make a direct request with shopId included
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/admin/category/add`,
          { 
            categoryName: newCategoryName,
            shopId: shopId 
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        
        console.log("Category added with explicit shopId:", response.data);
        
        // Success! Refresh categories
        fetchCategories();
        setCategory(newCategoryName);
        setNewCategoryName("");
        setShowNewCategoryInput(false);
        alert("Category added successfully!");
      } else if (result.error) {
        // Other error occurred
        throw new Error(result.error);
      } else {
        // Success with the standard approach
        console.log("Category added successfully:", result.data);
        fetchCategories();
        setCategory(newCategoryName);
        setNewCategoryName("");
        setShowNewCategoryInput(false);
        alert("Category added successfully!");
      }
    } catch (error) {
      console.error("Exception in add category:", error);
      setError("Failed to add category: " + (error.message || "Unknown error"));
    } finally {
      setAddingCategory(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <form className="p-10 sm:p-20 min-h-screen">
      <h1 className="text-2xl text-blue-500 mb-2">Add Product</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Fill in the details to add a new product
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="name"
          name="floating_name"
          id="floating_name"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label
          htmlFor="floating_name"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Name
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="file"
          name="floating_image"
          id="floating_image"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label
          htmlFor="floating_image"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Image
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="floating_description"
          id="floating_description"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label
          htmlFor="floating_description"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Description
        </label>
      </div>
      
      {/* Category Selection with Add New Option */}
      <div className="relative z-0 w-full mb-5 group">
        {!showNewCategoryInput ? (
          <div className="flex items-end space-x-2">
            <div className="flex-grow relative">
              <select
                name="floating_category"
                id="floating_category"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-8"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
              {/* Dropdown Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FiChevronDown size={16} />
              </div>
              <label
                htmlFor="floating_category"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Category
              </label>
            </div>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-medium text-sm py-2.5"
              onClick={toggleNewCategoryInput}
            >
              + Add New
            </button>
          </div>
        ) : (
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <input
                type="text"
                name="new_category"
                id="new_category"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
              />
              <label
                htmlFor="new_category"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                New Category Name
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="text-green-500 hover:text-green-700 font-medium text-sm py-2.5"
                onClick={handleAddCategory}
                disabled={addingCategory}
              >
                {addingCategory ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 font-medium text-sm py-2.5"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategoryName("");
                }}
                disabled={addingCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="floating_price"
          id="floating_price"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label
          htmlFor="floating_price"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Price
        </label>
      </div>
      <button
        type="submit"
        className="w-full py-3 mt-10 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
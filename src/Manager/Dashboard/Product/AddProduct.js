import React, { useEffect, useState } from "react";
import { FiChevronDown, FiEdit, FiTrash2 } from "react-icons/fi";
import ManagerService from "../../../Services/managerService";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  
  // New state for adding and editing categories
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [error, setError] = useState("");
  
  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const clearForm = () => {
    setName("");
    setImage("");
    setImageError("");
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

  // Handle image upload validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setImage("");
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageError("Please select a valid image file (JPG, JPEG, or PNG)");
      setImage("");
      e.target.value = ""; // Reset file input
      return;
    }
    
    // Clear error if valid
    setImageError("");
    setImage(file);
  };

  // Handle price input validation
  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for better UX
    if (value === "") {
      setPrice("");
      return;
    }
    
    // Convert to number and check if it's non-negative
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setPrice(value);
    }
    // If negative or not a number, don't update state (keeps previous valid value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Check for all required fields
    if (!name || !image || !description || !category || !price) {
      setError("Please fill all the fields");
      return;
    }

    // Additional validation to ensure price is positive
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Price must be a positive number");
      return;
    }

    // Check image type again
    if (image && image.type) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(image.type)) {
        setError("Please select a valid image file (JPG, JPEG, or PNG)");
        return;
      }
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
    setEditingCategory(false);
    setNewCategoryName("");
    setSelectedCategoryId("");
    
    if (!showNewCategoryInput) {
      setTimeout(() => {
        const input = document.getElementById("new_category");
        if (input) input.focus();
      }, 100);
    }
  };

  const startEditCategory = (categoryId, categoryName) => {
    setShowNewCategoryInput(true);
    setEditingCategory(true);
    setSelectedCategoryId(categoryId);
    setNewCategoryName(categoryName);
    
    setTimeout(() => {
      const input = document.getElementById("new_category");
      if (input) input.focus();
    }, 100);
  };

  const handleAddCategory = async () => {
    setError("");
    if (!newCategoryName.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (editingCategory) {
      // Handle category update
      handleUpdateCategory();
      return;
    }

    setAddingCategory(true);
    console.log("Adding new category:", newCategoryName);

    try {
      // Use ManagerService instead of AdminService
      const result = await ManagerService.addCategory({
        categoryName: newCategoryName
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log("Category added successfully:", result.data);
      fetchCategories();
      setCategory(newCategoryName);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
      alert("Category added successfully!");
    } catch (error) {
      console.error("Exception in add category:", error);
      setError("Failed to add category: " + (error.message || "Unknown error"));
    } finally {
      setAddingCategory(false);
    }
  };

  const handleUpdateCategory = async () => {
    setAddingCategory(true);
    
    try {
      // Use ManagerService instead of AdminService
      const result = await ManagerService.updateCategory({
        categoryId: selectedCategoryId,
        categoryName: newCategoryName
      });

      if (result.error) {
        throw new Error(result.error);
      }

      fetchCategories();
      setCategory(newCategoryName);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
      setEditingCategory(false);
      setSelectedCategoryId("");
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category: " + (error.message || "Unknown error"));
    } finally {
      setAddingCategory(false);
    }
  };

  // Open confirmation dialog for category deletion
  const confirmDeleteCategory = (categoryId, categoryName) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setShowConfirmation(true);
  };

  // Proceed with actual deletion
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      // Use ManagerService instead of AdminService
      const result = await ManagerService.deleteCategory(categoryToDelete.id);

      if (result.error) {
        throw new Error(result.error);
      }

      fetchCategories();
      
      // Reset selected category if it was the deleted one
      if (category === categoryToDelete.name) {
        setCategory("");
      }
      
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category: " + (error.message || "Unknown error"));
    } finally {
      // Close confirmation dialog
      setShowConfirmation(false);
      setCategoryToDelete(null);
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
      
      {/* Image Upload with File Type Validation */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="file"
          name="floating_image"
          id="floating_image"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
        />
        <label
          htmlFor="floating_image"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Image (JPG, JPEG, PNG only)
        </label>
        {imageError && (
          <p className="mt-1 text-xs text-red-500">{imageError}</p>
        )}
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
      
      {/* Category Selection with Add/Edit/Delete Options */}
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
                {editingCategory ? "Edit Category Name" : "New Category Name"}
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="text-green-500 hover:text-green-700 font-medium text-sm py-2.5"
                onClick={handleAddCategory}
                disabled={addingCategory}
              >
                {addingCategory ? "Saving..." : editingCategory ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 font-medium text-sm py-2.5"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategoryName("");
                  setEditingCategory(false);
                  setSelectedCategoryId("");
                }}
                disabled={addingCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Price Input with Validation */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="floating_price"
          id="floating_price"
          min="0"
          step="0.01"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={price}
          onChange={handlePriceChange}
          onKeyDown={(e) => {
            // Prevent minus sign and e (for scientific notation)
            if (e.key === '-' || e.key === 'e') {
              e.preventDefault();
            }
          }}
        />
        <label
          htmlFor="floating_price"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Price
        </label>
        {/* Addition of helper text */}
        <p className="mt-1 text-xs text-gray-500">Enter a positive price value (e.g., 9.99)</p>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 mt-10 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Add Product
      </button>
      
      {Array.isArray(categories) && categories.length > 0 && !showNewCategoryInput && (
        <div className="mb-6 bg-white p-4 my-10 ">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Category Management</h3>
          <div className="max-h-40 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-1">Category Name</th>
                  <th className="text-right py-2 px-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id} className="border-b border-gray-100">
                    <td className="py-2 px-1">{cat.category_name}</td>
                    <td className="text-right py-2 px-1">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 mx-1"
                        onClick={() => startEditCategory(cat._id, cat.category_name)}
                        title="Edit Category"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 mx-1"
                        onClick={() => confirmDeleteCategory(cat._id, cat.category_name)}
                        title="Delete Category"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete category "{categoryToDelete.name}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                onClick={() => {
                  setShowConfirmation(false);
                  setCategoryToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddProduct;
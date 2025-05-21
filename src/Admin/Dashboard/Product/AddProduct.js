import axios from "axios";
import { useEffect, useState } from "react";
import { FiChevronDown, FiEdit, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import AdminService from "../../../Services/adminService";
import ManagerService from "../../../Services/managerService";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  
  // State for variations
  const [variations, setVariations] = useState([]);
  const [currentVariation, setCurrentVariation] = useState({ name: "", options: [{ name: "", additionalCharge: 0 }] });
  const [showVariationForm, setShowVariationForm] = useState(false);
  
  // State for CSV upload
  const [csvFile, setCsvFile] = useState(null);
  const [csvError, setCsvError] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  
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
    setCsvFile(null);
    setCsvError("");
    setUploadStatus(null);
    setVariations([]);
    setCurrentVariation({ name: "", options: [{ name: "", additionalCharge: 0 }] });
    setShowVariationForm(false);
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

  // Handle CSV file change
  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setCsvFile(null);
      setCsvError("");
      return;
    }
    
    // Check file type
    if (file.type !== 'text/csv') {
      setCsvError("Please select a valid CSV file");
      setCsvFile(null);
      e.target.value = "";
      return;
    }
    
    setCsvError("");
    setCsvFile(file);
    setUploadStatus(null);
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
  };

  // Variation handling functions
  const handleVariationNameChange = (e) => {
    setCurrentVariation({
      ...currentVariation,
      name: e.target.value
    });
  };

  const handleOptionNameChange = (index, e) => {
    const updatedOptions = [...currentVariation.options];
    updatedOptions[index].name = e.target.value;
    setCurrentVariation({
      ...currentVariation,
      options: updatedOptions
    });
  };

  const handleAdditionalChargeChange = (index, e) => {
    const value = e.target.value;
    
    // Allow empty string for better UX
    if (value === "") {
      const updatedOptions = [...currentVariation.options];
      updatedOptions[index].additionalCharge = "";
      setCurrentVariation({
        ...currentVariation,
        options: updatedOptions
      });
      return;
    }
    
    // Convert to number and check if it's non-negative
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      const updatedOptions = [...currentVariation.options];
      updatedOptions[index].additionalCharge = numValue;
      setCurrentVariation({
        ...currentVariation,
        options: updatedOptions
      });
    }
  };

  const addOption = () => {
    setCurrentVariation({
      ...currentVariation,
      options: [...currentVariation.options, { name: "", additionalCharge: 0 }]
    });
  };

  const removeOption = (index) => {
    if (currentVariation.options.length > 1) {
      const updatedOptions = currentVariation.options.filter((_, i) => i !== index);
      setCurrentVariation({
        ...currentVariation,
        options: updatedOptions
      });
    }
  };

  const addVariation = () => {
    // Validate variation
    if (!currentVariation.name) {
      setError("Please enter a variation name");
      return;
    }
    
    if (currentVariation.options.some(option => !option.name)) {
      setError("Please enter names for all options");
      return;
    }
    
    // Add variation to the list
    setVariations([...variations, {...currentVariation}]);
    
    // Reset current variation
    setCurrentVariation({ name: "", options: [{ name: "", additionalCharge: 0 }] });
    setShowVariationForm(false);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const editVariation = (index) => {
    setCurrentVariation({...variations[index]});
    setVariations(variations.filter((_, i) => i !== index));
    setShowVariationForm(true);
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
    
    // Add variations if any
    if (variations.length > 0) {
      formData.append("variations", JSON.stringify(variations));
    }

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

  // Handle CSV upload
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    setError("");
    setUploadStatus(null);

    if (!csvFile) {
      setCsvError("Please select a CSV file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("csvFile", csvFile);

      const response = await ManagerService.bulkUploadProducts(formData);
      
      if (response.error) {
        setError("Failed to upload products: " + response.error);
        return;
      }

      setUploadStatus({
        message: response.data.message,
        totalProcessed: response.data.totalProcessed,
        successful: response.data.successful,
        errors: response.data.errors,
        errorDetails: response.data.errorDetails
      });
      
      alert(`Bulk upload completed! ${response.data.successful} products added successfully.`);
      
      // Reset CSV file input
      setCsvFile(null);
      document.getElementById("floating_csv").value = "";
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError("Failed to upload CSV file: " + (err.message || "Unknown error"));
    }
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

  // Try to get shopId from JWT token
  const getShopIdFromToken = async () => {
    try {
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

    if (editingCategory) {
      handleUpdateCategory();
      return;
    }

    setAddingCategory(true);
    console.log("Adding new category:", newCategoryName);

    try {
      const result = await AdminService.addCategory({
        categoryName: newCategoryName
      });

      if (result.error && result.error.includes("shop_id")) {
        console.log("Trying to add category with explicit shopId");
        const shopId = await getShopIdFromToken();
        
        if (!shopId) {
          throw new Error("Could not retrieve shop ID");
        }
        
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
        fetchCategories();
        setCategory(newCategoryName);
        setNewCategoryName("");
        setShowNewCategoryInput(false);
        alert("Category added successfully!");
      } else if (result.error) {
        throw new Error(result.error);
      } else {
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

  const handleUpdateCategory = async () => {
    setAddingCategory(true);
    
    try {
      const result = await AdminService.updateCategory({
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

  const confirmDeleteCategory = (categoryId, categoryName) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setShowConfirmation(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      const result = await AdminService.deleteCategory(categoryToDelete.id);

      if (result.error) {
        throw new Error(result.error);
      }

      fetchCategories();
      if (category === categoryToDelete.name) {
        setCategory("");
      }
      
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category: " + (error.message || "Unknown error"));
    } finally {
      setShowConfirmation(false);
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-10 sm:p-20 min-h-screen">
      <h1 className="text-2xl text-blue-500 mb-2">Add Product</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Add products individually or upload multiple products using a CSV file
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Single Product Form */}
      <form className="mb-10">
        <h2 className="text-lg text-blue-500 mb-4">Add Single Product</h2>
        
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
          <p className="mt-1 text-xs text-gray-500">Enter a positive price value (e.g., 9.99)</p>
        </div>
        
        {/* Product Variations Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md text-blue-500">Product Variations</h3>
            {!showVariationForm && (
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center"
                onClick={() => setShowVariationForm(true)}
              >
                <FiPlus className="mr-1" /> Add Variation
              </button>
            )}
          </div>
          
          {/* Display existing variations */}
          {variations.length > 0 && (
            <div className="mb-5 space-y-4">
              {variations.map((variation, variationIndex) => (
                <div key={variationIndex} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{variation.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => editVariation(variationIndex)}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeVariation(variationIndex)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {variation.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex justify-between bg-white rounded p-2">
                        <span>{option.name}</span>
                        <span className="text-gray-600">
                          {option.additionalCharge > 0 
                            ? `+${option.additionalCharge.toFixed(2)}`
                            : "No extra charge"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Variation form */}
          {showVariationForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Add Variation</h4>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowVariationForm(false);
                    setCurrentVariation({ name: "", options: [{ name: "", additionalCharge: 0 }] });
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variation Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Size, Color, Flavor"
                  value={currentVariation.name}
                  onChange={handleVariationNameChange}
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                    onClick={addOption}
                  >
                    <FiPlus className="mr-1" size={14} /> Add Option
                  </button>
                </div>
                
                {currentVariation.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-2">
                    <div className="flex-grow">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Option name (e.g., Small, Red, Vanilla)"
                        value={option.name}
                        onChange={(e) => handleOptionNameChange(index, e)}
                      />
                    </div>
                    <div className="w-1/3">
                      <div className="relative">
                        <span className="absolute left-3 top-2">+</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full p-2 pl-6 border border-gray-300 rounded-md"
                          placeholder="Extra charge"
                          value={option.additionalCharge}
                          onChange={(e) => handleAdditionalChargeChange(index, e)}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                    {currentVariation.options.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeOption(index)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={addVariation}
              >
                {currentVariation.name ? `Add "${currentVariation.name}" Variation` : "Add Variation"}
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-3 mt-10 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Add Product
        </button>
      </form>
      
      {/* CSV Upload Form */}
      <form className="mb-10">
        <h2 className="text-lg text-blue-500 mb-4">Bulk Upload Products</h2>
        
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="file"
            name="floating_csv"
            id="floating_csv"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            accept=".csv"
            onChange={handleCsvChange}
          />
          <label
            htmlFor="floating_csv"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            CSV File (name,description,price,category_name)
          </label>
          {csvError && (
            <p className="mt-1 text-xs text-red-500">{csvError}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            CSV should have columns: name,description,price,category_name
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Note: Bulk upload currently doesn't support product variations. Add variations individually.
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-green-500 rounded-md text-white text-sm hover:bg-green-600"
          onClick={handleCsvUpload}
        >
          Upload CSV
        </button>
      </form>
      
      {/* Upload Status Display */}
      {uploadStatus && (
        <div className="mb-6 bg-white p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Results</h3>
          <p>Total Processed: {uploadStatus.totalProcessed}</p>
          <p>Successfully Added: {uploadStatus.successful}</p>
          <p>Errors: {uploadStatus.errors}</p>
          {uploadStatus.errorDetails && uploadStatus.errorDetails.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Error Details:</h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-1">Row</th>
                      <th className="text-left py-2 px-1">Error</th>
                      <th className="text-left py-2 px-1">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadStatus.errorDetails.map((error, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-1">{error.row}</td>
                        <td className="py-2 px-1">{error.message}</td>
                        <td className="py-2 px-1">{JSON.stringify(error.data)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Category Management Section */}
      {Array.isArray(categories) && categories.length > 0 && !showNewCategoryInput && (
        <div className="mb-6 bg-white p-4 my-10">
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
    </div>
  );
};

export default AddProduct;
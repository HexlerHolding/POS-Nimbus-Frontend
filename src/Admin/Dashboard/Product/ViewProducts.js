import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import { toast } from "react-toastify";
import AdminService from "../../../Services/adminService";
import ManagerService from "../../../Services/managerService";


// Bind modal to app element for accessibility
Modal.setAppElement("#root");

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    variation: []
  });
  const [loading, setLoading] = useState(false);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    ManagerService.getProducts()
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setProducts(data.data.products);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to fetch products");
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    ManagerService.getCategories()
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setCategories(data.data);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch categories");
      });
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category._id,
      image: product.image || "",
      variation: product.variation || []
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? parseFloat(value) : value
    });
  };

  const handleVariationChange = (e) => {
    const variationText = e.target.value;
    const variationArray = variationText
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== "");
    
    setEditFormData({
      ...editFormData,
      variation: variationArray
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updateData = {
      productId: currentProduct._id,
      ...editFormData
    };

    ManagerService.updateProduct(updateData)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Product updated successfully");
          setIsEditModalOpen(false);
          fetchProducts();
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to update product");
        setLoading(false);
      });
  };

  const handleDeleteConfirm = () => {
    setLoading(true);
    
    AdminService.deleteProduct(currentProduct._id)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Product deleted successfully");
          setIsDeleteModalOpen(false);
          fetchProducts();
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to delete product");
        setLoading(false);
      });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5 text-white">Products</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative w-full p-5 rounded-lg shadow-md flex flex-col justify-between card"
              style={{ background: "#2c302c", minHeight: "400px" }}
            >
              <div>
                <img
                  src={product.image || "https://via.placeholder.com/300x150"}
                  alt={product.name}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
                <h3 className="text-white text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{product.description}</p>
                <p className="text-gray-300 text-sm mb-1">
                  <span className="font-semibold">Category:</span> {product.category.category_name}
                </p>
                {product.variation && product.variation.length > 0 && (
                  <p className="text-gray-300 text-sm mb-1">
                    <span className="font-semibold">Variations:</span> {product.variation.join(", ")}
                  </p>
                )}
                <p className="text-gray-300 text-2xl font-bold mt-3">${product.price.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md flex items-center"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md flex items-center"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="bg-gray-800 text-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        shouldCloseOnOverlayClick={true}
      >
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              rows="3"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={editFormData.price}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={editFormData.category}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={editFormData.image}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Enter image URL"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Variations (comma separated)</label>
            <input
              type="text"
              name="variations"
              value={editFormData.variation.join(", ")}
              onChange={handleVariationChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Small, Medium, Large"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-gray-800 text-white p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        shouldCloseOnOverlayClick={true}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-6">
          Are you sure you want to delete the product "{currentProduct?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ViewProducts;
import React, { useState } from "react";
import AdminService from "../../../Services/adminService";
import FbrTaxService from "../../../Services/fbrTaxService";

const BranchTaxUpdate = ({ branch, onTaxesUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fbrTaxes, setFbrTaxes] = useState(null);
  const [currentTaxes, setCurrentTaxes] = useState({
    card_tax: branch.card_tax || 0,
    cash_tax: branch.cash_tax || 0
  });

  // Fetch tax rates from FBR
  const fetchFbrTaxRates = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      // This is a placeholder for future FBR API integration
      const response = await FbrTaxService.fetchTaxRates();
      
      if (response.error) {
        // If there's an error but we have mock data for development
        if (response.mockData) {
          setFbrTaxes(response.mockData);
          setMessage({ 
            text: "Using mock FBR tax data for development purposes", 
            type: "info" 
          });
        } else {
          setMessage({ 
            text: `Failed to fetch FBR tax rates: ${response.error}`, 
            type: "error" 
          });
        }
      } else {
        setFbrTaxes(response.data);
        setMessage({ 
          text: "FBR tax rates fetched successfully", 
          type: "success" 
        });
      }
    } catch (error) {
      console.error("Error fetching FBR tax rates:", error);
      setMessage({ 
        text: `Error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply FBR tax rates to branch
  const applyFbrTaxRates = async () => {
    if (!fbrTaxes) {
      setMessage({ 
        text: "Please fetch FBR tax rates first", 
        type: "warning" 
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // In a real implementation, this would call your backend API
      // to update the branch with FBR tax rates
      const response = await AdminService.updateBranchWithFbrTaxes(branch._id);
      
      if (response.error) {
        setMessage({ 
          text: `Failed to update branch with FBR tax rates: ${response.error}`, 
          type: "error" 
        });
      } else {
        // Update local state with new tax rates
        setCurrentTaxes({
          card_tax: fbrTaxes.card_tax,
          cash_tax: fbrTaxes.cash_tax
        });
        
        setMessage({ 
          text: "Branch tax rates updated successfully with FBR rates", 
          type: "success" 
        });
        
        // Notify parent component of the update
        if (onTaxesUpdated) {
          onTaxesUpdated({
            card_tax: fbrTaxes.card_tax,
            cash_tax: fbrTaxes.cash_tax
          });
        }
      }
    } catch (error) {
      console.error("Error applying FBR tax rates:", error);
      setMessage({ 
        text: `Error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle manual tax rate changes
  const handleTaxChange = (e, taxType) => {
    const value = parseFloat(e.target.value) || 0;
    setCurrentTaxes(prev => ({
      ...prev,
      [taxType]: value
    }));
  };

  // Save manually updated tax rates
  const saveManualTaxRates = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // In a real implementation, this would call your backend API
      // to update the branch with the manually entered tax rates
      const response = await AdminService.updateBranch({
        branchId: branch._id,
        card_tax: currentTaxes.card_tax,
        cash_tax: currentTaxes.cash_tax
      });
      
      if (response.error) {
        setMessage({ 
          text: `Failed to update tax rates: ${response.error}`, 
          type: "error" 
        });
      } else {
        setMessage({ 
          text: "Tax rates updated successfully", 
          type: "success" 
        });
        
        // Notify parent component of the update
        if (onTaxesUpdated) {
          onTaxesUpdated(currentTaxes);
        }
      }
    } catch (error) {
      console.error("Error saving tax rates:", error);
      setMessage({ 
        text: `Error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Tax Rates Management
      </h2>
      
      {/* Message display */}
      {message.text && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === "success" ? "bg-green-100 text-green-700" : 
          message.type === "error" ? "bg-red-100 text-red-700" :
          message.type === "warning" ? "bg-yellow-100 text-yellow-700" :
          "bg-blue-100 text-blue-700"
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Current Tax Rates Display */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Current Tax Rates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              step="0.01"
              name="card_tax"
              id="card_tax"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={currentTaxes.card_tax}
              onChange={(e) => handleTaxChange(e, "card_tax")}
            />
            <label
              htmlFor="card_tax"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Card Tax Rate (%)
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              step="0.01"
              name="cash_tax"
              id="cash_tax"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={currentTaxes.cash_tax}
              onChange={(e) => handleTaxChange(e, "cash_tax")}
            />
            <label
              htmlFor="cash_tax"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Cash Tax Rate (%)
            </label>
          </div>
        </div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={saveManualTaxRates}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Tax Rates"}
        </button>
      </div>
      
      {/* FBR Integration Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          FBR Integration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Fetch and apply official tax rates from the Federal Board of Revenue (FBR).
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={fetchFbrTaxRates}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch FBR Tax Rates"}
          </button>
          
          {fbrTaxes && (
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              onClick={applyFbrTaxRates}
              disabled={loading}
            >
              Apply FBR Tax Rates
            </button>
          )}
        </div>
        
        {/* FBR Rates Display */}
        {fbrTaxes && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              FBR Tax Rates
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Last fetched: {new Date(fbrTaxes.fetched_at).toLocaleString()}
            </p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Card Tax Rate:</span>
                <span className="font-medium">{fbrTaxes.card_tax}%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Cash Tax Rate:</span>
                <span className="font-medium">{fbrTaxes.cash_tax}%</span>
              </li>
            </ul>
            
            {fbrTaxes.is_mock && (
              <div className="mt-3 text-xs text-orange-600 dark:text-orange-400 italic">
                Note: These are mock values for development. Integration with actual FBR API is pending.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchTaxUpdate;
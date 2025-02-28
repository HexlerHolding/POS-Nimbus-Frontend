import React, { useState } from "react";
import AdminService from "../../../Services/adminService";

const BranchAdd = () => {
  const [branch, setBranch] = useState({
    branchName: "",
    opening_time: "",
    closing_time: "",
    total_tables: "",
    address: "",
    city: "",
    phone: "",
    card_tax: "",
    cash_tax: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [fbrTaxes, setFbrTaxes] = useState(null);
  const [useFbrTaxes, setUseFbrTaxes] = useState(false);
  const [taxModified, setTaxModified] = useState(false);

  // This function will fetch tax rates from FBR API in the future
  const fetchFbrTaxes = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual FBR API integration
      // This is a placeholder for future implementation
      // const response = await fetch('https://api.fbr.gov.pk/taxes');
      // const data = await response.json();
      
      // For now, simulate API response with mock data
      setTimeout(() => {
        const mockFbrData = {
          card_tax: 2.5,
          cash_tax: 1.5,
          fetched_at: new Date().toISOString(),
        };
        
        setFbrTaxes(mockFbrData);
        
        // Only auto-apply if taxes haven't been manually modified
        if (!taxModified) {
          setBranch(prev => ({
            ...prev,
            card_tax: mockFbrData.card_tax,
            cash_tax: mockFbrData.cash_tax
          }));
        }
        
        setLoading(false);
      }, 1000); // Simulate network delay
    } catch (error) {
      console.error("Error fetching FBR tax rates:", error);
      setLoading(false);
    }
  };

  // Handle tax value changes and mark as modified
  const handleTaxChange = (e, taxType) => {
    const value = parseFloat(e.target.value);
    // Ensure value is not negative
    if (value < 0 || isNaN(value)) {
      setTaxModified(true);
      setBranch({ ...branch, [taxType]: "" });
    } else {
      setTaxModified(true);
      setBranch({ ...branch, [taxType]: e.target.value });
    }
  };

  // Handle numeric input to prevent negative values
  const handleNumericInput = (e, field) => {
    const value = e.target.value;
    // Allow empty input
    if (value === "") {
      setBranch({ ...branch, [field]: value });
      return;
    }
    
    // Parse as number and validate
    const numValue = parseFloat(value);
    if (numValue >= 0) {
      setBranch({ ...branch, [field]: value });
    }
    // If negative, don't update state (keeps previous valid value)
  };

  // Apply FBR taxes to form
  const applyFbrTaxes = () => {
    if (fbrTaxes) {
      setBranch(prev => ({
        ...prev,
        card_tax: fbrTaxes.card_tax,
        cash_tax: fbrTaxes.cash_tax
      }));
      setTaxModified(false);
    }
  };

  // Reset tax modifications
  const resetTaxes = () => {
    setBranch(prev => ({
      ...prev,
      card_tax: "",
      cash_tax: ""
    }));
    setTaxModified(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!branch.branchName || !branch.address || !branch.city || !branch.phone) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Convert empty values to 0 for submission
    const formData = {
      branchName: branch.branchName,
      opening_time: branch.opening_time,
      closing_time: branch.closing_time,
      total_tables: branch.total_tables === "" ? 0 : parseInt(branch.total_tables, 10),
      address: branch.address,
      city: branch.city,
      contact: branch.phone,
      card_tax: branch.card_tax === "" ? 0 : parseFloat(branch.card_tax),
      cash_tax: branch.cash_tax === "" ? 0 : parseFloat(branch.cash_tax),
    };
    
    console.log("Submitting branch data:", formData);

    AdminService.addBranch(formData).then((res) => {
      console.log(res);
      if (res.error) {
        alert("Error adding branch: " + res.error);
      } else {
        alert("Branch added successfully");
        setBranch({
          branchName: "",
          opening_time: "",
          closing_time: "",
          total_tables: "",
          address: "",
          city: "",
          phone: "",
          card_tax: "",
          cash_tax: "",
        });
        setTaxModified(false);
      }
    });
  };

  return (
    <form className="p-10 sm:p-20 min-h-screen">
      <h1 className="text-2xl text-blue-500 mb-2">Add Branch</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Fill in the details to add a new branch to the system
      </p>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="branchName"
          id="branchName"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          onChange={(e) => setBranch({ ...branch, branchName: e.target.value })}
          value={branch.branchName}
        />
        <label
          htmlFor="branchName"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Branch Name
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="time"
            name="opening_time"
            id="opening_time"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) =>
              setBranch({ ...branch, opening_time: e.target.value })
            }
            value={branch.opening_time}
          />
          <label
            htmlFor="opening_time"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Opening Time
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="time"
            name="closing_time"
            id="closing_time"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) =>
              setBranch({ ...branch, closing_time: e.target.value })
            }
            value={branch.closing_time}
          />
          <label
            htmlFor="closing_time"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Closing Time
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="address"
            id="address"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) => setBranch({ ...branch, address: e.target.value })}
            value={branch.address}
          />
          <label
            htmlFor="address"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="city"
            id="city"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) => setBranch({ ...branch, city: e.target.value })}
            value={branch.city}
          />
          <label
            htmlFor="city"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            City
          </label>
        </div>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            name="phone"
            id="phone"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) => setBranch({ ...branch, phone: e.target.value })}
            value={branch.phone}
          />
          <label
            htmlFor="phone"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone number (123-456-7890)
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="total_tables"
            id="total_tables"
            min="0"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            onChange={(e) => handleNumericInput(e, 'total_tables')}
            value={branch.total_tables}
            onKeyDown={(e) => {
              // Prevent minus sign and e (for scientific notation)
              if (e.key === '-' || e.key === 'e') {
                e.preventDefault();
              }
            }}
          />
          <label
            htmlFor="total_tables"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Total Tables
          </label>
        </div>
      </div>

      {/* Tax Section with FBR Integration */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Tax Settings</h3>
        
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              step="0.01"
              min="0"
              name="card_tax"
              id="card_tax"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              onChange={(e) => handleTaxChange(e, 'card_tax')}
              value={branch.card_tax}
              onKeyDown={(e) => {
                // Prevent minus sign and e
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }}
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
              min="0"
              name="cash_tax"
              id="cash_tax"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              onChange={(e) => handleTaxChange(e, 'cash_tax')}
              value={branch.cash_tax}
              onKeyDown={(e) => {
                // Prevent minus sign and e
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }}
            />
            <label
              htmlFor="cash_tax"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Cash Tax Rate (%)
            </label>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
          Tax rates can be manually entered now. Integration with FBR for automatic tax rates will be available in a future update.
        </p>
      </div>

      <button
        type="submit"
        className="mt-5 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </form>
  );
};

export default BranchAdd;
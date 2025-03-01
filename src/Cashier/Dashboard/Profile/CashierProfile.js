import React, { useEffect, useState } from 'react';
import pfp2 from '../../../Assets/pfp2.jpeg'; // Default profile picture
import cashierService from '../../../Services/cashierService';
import useStore from '../../../Store/store';
import CashierProfileUpdate from './CashierProfileUpdate';

const CashierProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { setUserRole } = useStore();

  useEffect(() => {
    const fetchCashierProfile = async () => {
      try {
        const response = await cashierService.getCashierProfile();
        
        console.log("Full response:", response);
        
        if (response.error) {
          // If there's an error in the response
          setError(response.error);
          
          // Check if the error suggests an authentication issue
          if (response.error.includes('Unauthorized') || response.error.includes('Token')) {
            // Clear user role and redirect to login
            setUserRole(null);
            window.location.href = "/login";
            return;
          }
        }
        
        if (response.data) {
          setProfile(response.data);
          setLoading(false);
        } else {
          setError('Unable to fetch profile information');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching cashier profile:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchCashierProfile();
  }, [setUserRole]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      cashier: updatedProfile.cashier
    }));
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  // If in editing mode, render the update form
  if (isEditing) {
    return (
      <CashierProfileUpdate 
        profile={profile} 
        onProfileUpdate={handleProfileUpdate}
      />
    );
  }

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-500 h-24 relative">
          <img 
            src={profile.shop?.logo || pfp2} 
            alt="Profile" 
            className="w-32 h-32 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white"
          />
        </div>
        
        <div className="pt-20 p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800">
            {profile.cashier.username}
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Cashier
          </p>
          <p className="text-center text-gray-500 mt-1">
            Status: <span className={`font-medium ${profile.cashier.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
              {profile.cashier.status}
            </span>
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Cashier Information</h2>
              <p><strong>Username:</strong> {profile.cashier.username}</p>
              <p><strong>Joining Date:</strong> {formatDate(profile.cashier.joining_date)}</p>
              <p><strong>Salary:</strong> {profile.cashier.salary ? `$${profile.cashier.salary}` : 'Not set'}</p>
              <p><strong>Salary Due Date:</strong> {formatDate(profile.cashier.salary_due_date)}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Branch Information</h2>
              {profile.branch ? (
                <>
                  <p><strong>Branch Name:</strong> {profile.branch.name}</p>
                  <p><strong>Address:</strong> {profile.branch.address || 'Not provided'}</p>
                  <p><strong>City:</strong> {profile.branch.city || 'Not provided'}</p>
                  <p><strong>Contact:</strong> {profile.branch.contact || 'Not provided'}</p>
                </>
              ) : (
                <p className="text-gray-500">No branch information available</p>
              )}
            </div>

            <div className="bg-gray-100 p-4 rounded-lg md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Shop Information</h2>
              {profile.shop ? (
                <>
                  <p><strong>Shop Name:</strong> {profile.shop.name}</p>
                </>
              ) : (
                <p className="text-gray-500">No shop information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierProfile;
import React, { useEffect, useState } from 'react';
import pfp2 from '../../../Assets/pfp2.jpeg'; // Default profile picture
import adminService from '../../../Services/adminService';
import useStore from '../../../Store/store';
import AdminProfileUpdate from './AdminProfileUpdate';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { setUserRole } = useStore();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await adminService.getAdminProfile();
        
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
        console.error('Error fetching admin profile:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [setUserRole]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      admin: updatedProfile.admin
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
      <AdminProfileUpdate 
        profile={profile} 
        onProfileUpdate={handleProfileUpdate}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-500 h-24 relative">
          <img 
            src={pfp2} 
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
            {profile.admin.first_name} {profile.admin.last_name}
          </h1>
          <p className="text-center text-gray-600 mt-2">
            {profile.admin.role.charAt(0).toUpperCase() + profile.admin.role.slice(1)}
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h2>
              <p><strong>Username:</strong> {profile.admin.username}</p>
              <p><strong>Email:</strong> {profile.admin.email || 'Not provided'}</p>
              <p><strong>Contact:</strong> {profile.admin.contact || 'Not provided'}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Shop Details</h2>
              {profile.shop ? (
                <>
                  <p><strong>Shop Name:</strong> {profile.shop.name}</p>
                  <p><strong>Address:</strong> {profile.shop.address || 'Not provided'}</p>
                  <p><strong>Shop Contact:</strong> {profile.shop.contact || 'Not provided'}</p>
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

export default AdminProfile;
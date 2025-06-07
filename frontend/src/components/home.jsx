import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, Shield, Settings } from 'lucide-react';
import Toast from './Toast';

export default function Home() {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    showToast('Logged out successfully!');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  if (!user) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header with user info and logout button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600 mt-1">Manage your account and settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-orange-500/10 border border-orange-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                <p className="text-gray-500 text-sm">Your personal details</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <User className="text-orange-600" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <Phone className="text-orange-600" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-orange-500/10 border border-orange-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Settings className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
                <p className="text-gray-500 text-sm">Manage your account</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-200">
                <Shield className="text-orange-600" size={18} />
                <div className="text-left">
                  <p className="font-medium text-gray-800">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-200">
                <Phone className="text-orange-600" size={18} />
                <div className="text-left">
                  <p className="font-medium text-gray-800">Update Phone Number</p>
                  <p className="text-sm text-gray-500">Change your contact number</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
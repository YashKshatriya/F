import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Toast from './Toast';

export default function Home() {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

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
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600">Welcome to Home Page</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-200 shadow-lg shadow-orange-500/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-orange-500/10 border border-orange-100">
          <p className="text-gray-600">This is a protected route. You can only see this if you're logged in.</p>
          
          {/* User info section */}
          <div className="mt-6 p-4 bg-orange-50 rounded-xl">
            <h2 className="text-lg font-semibold text-orange-700 mb-2">Your Profile</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {JSON.parse(localStorage.getItem('user'))?.name || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {JSON.parse(localStorage.getItem('user'))?.phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Toast from './Toast';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      // Show toast message when redirecting
      const toast = document.createElement('div');
      toast.id = 'redirect-toast';
      toast.innerHTML = `
        <div class="fixed top-4 right-4 z-50 animate-slide-in">
          <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="flex-grow text-sm">Please login first to access this page</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);

      // Remove toast after 3 seconds
      setTimeout(() => {
        const toastElement = document.getElementById('redirect-toast');
        if (toastElement) {
          toastElement.remove();
        }
      }, 3000);
    }
  }, [token]);

  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 
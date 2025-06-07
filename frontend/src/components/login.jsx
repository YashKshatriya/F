import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Phone, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../apis/axios';
import Toast from './Toast';
import config from '../config';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  // Show welcome back message if redirected from protected route
  useEffect(() => {
    if (location.state?.from) {
      showToast('Please login to continue', 'error');
    }
  }, [location]);

  const validateForm = () => {
    const errors = {};
    
    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError(''); // Clear general error
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Sending login request with data:', formData);
      console.log('API URL:', config.API_URL);

      const response = await axiosInstance.post('/auth/login', {
        phone: formData.phone,
        password: formData.password
      });

      console.log('Login response:', response.data);

      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          phone: response.data.phone
        }));
        
        // Show success toast
        showToast('Login successful! Redirecting...', 'success');
        
        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.response) {
        // Server responded with an error
        console.error('Server error response:', err.response.data);
        errorMessage = err.response.data.message || 'Login failed. Please try again.';
      } else if (err.request) {
        // Request was made but no response
        console.error('No response received:', err.request);
        errorMessage = 'Unable to reach the server. Please check your internet connection.';
      } else {
        // Something else went wrong
        console.error('Error setting up request:', err.message);
      }
      
      setError(errorMessage);
      showToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Main card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-500/10 p-6 border border-white/20">
          {/* Header */}
          <div className="text-center mb-4">
            {/* Logo */}
            <div className="flex flex-col items-center mb-4">
              <img
                className="mx-auto h-12 w-auto"
                src="/logo.jpg"
                alt="Radhe Fiber Logo"
              />
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1a1a] mb-2">
                <Lock className="text-white" size={14} />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-1">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm mb-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Phone number field */}
            <div className="relative">
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                formData.phone ? 'text-orange-500' : 'text-gray-400'
              }`}>
                <Phone size={16} />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className={`w-full pl-9 pr-3 py-2 bg-white border-2 ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-200'
                } rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/10 hover:border-gray-300 text-sm`}
                required
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* Password field */}
            <div className="relative">
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                formData.password ? 'text-orange-500' : 'text-gray-400'
              }`}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full pl-9 pr-9 py-2 bg-white border-2 ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-200'
                } rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/10 hover:border-gray-300 text-sm`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button type="button" className="text-orange-600 hover:text-orange-800 text-xs font-medium transition-colors duration-200">
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                isSubmitting
                  ? 'opacity-80 cursor-not-allowed'
                  : 'hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/" className="text-orange-600 hover:text-orange-800 font-semibold transition-colors duration-200">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl opacity-60 animate-float"></div>
        <div className="absolute -bottom-4 -right-4 w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg opacity-60 animate-float delay-500"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
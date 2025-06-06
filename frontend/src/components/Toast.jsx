import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50';
  const borderColor = type === 'error' ? 'border-red-200' : 'border-green-200';
  const textColor = type === 'error' ? 'text-red-600' : 'text-green-600';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} ${borderColor} ${textColor} px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 min-w-[300px] max-w-md`}>
        <Icon size={20} className="flex-shrink-0" />
        <p className="flex-grow text-sm">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast; 
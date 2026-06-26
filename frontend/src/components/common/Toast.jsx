import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, []);

  const styles = {
    success: 'bg-green-900/80 border-cs2-green text-white',
    error: 'bg-red-900/80 border-cs2-red text-white',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl backdrop-blur-sm animate-in ${styles[type]}`}>
      {type === 'success'
        ? <CheckCircleIcon className="w-5 h-5 text-cs2-green flex-shrink-0" />
        : <XCircleIcon className="w-5 h-5 text-cs2-red flex-shrink-0" />
      }
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

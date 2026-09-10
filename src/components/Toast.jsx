
import React, { useEffect } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onClose && onClose(), 4200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const meta = {
    info: { cls: 'border-blue-200 bg-blue-50 text-blue-900', icon: <Info size={18} /> },
    success: { cls: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: <CheckCircle2 size={18} /> },
    error: { cls: 'border-red-200 bg-red-50 text-red-900', icon: <XCircle size={18} /> }
  };

  const info = meta[type] || meta.info;

  return (
    <div
      className={`sp-toast-enter fixed right-4 bottom-4 z-50 max-w-sm rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${info.cls}`}
      role="status"
    >
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold flex items-center gap-2">{info.icon}<span className="flex-1 text-sm font-medium">{message}</span></div>
        {onClose && (
          <button onClick={onClose} className="opacity-60 hover:opacity-100" aria-label="Close notification">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;

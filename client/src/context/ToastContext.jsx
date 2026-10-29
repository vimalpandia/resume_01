import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 6);
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              border: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
            },
            error: {
              border: 'border-rose-500/40 bg-rose-950/90 text-rose-100',
              icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
            },
            warning: {
              border: 'border-amber-500/40 bg-amber-950/90 text-amber-100',
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
            },
            info: {
              border: 'border-blue-500/40 bg-slate-900/95 text-blue-100',
              icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
            },
          }[toast.type] || {
            border: 'border-slate-700 bg-slate-900/95 text-slate-100',
            icon: <Info className="w-5 h-5 text-slate-400 shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md border ${typeConfig.border} transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
            >
              {typeConfig.icon}
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

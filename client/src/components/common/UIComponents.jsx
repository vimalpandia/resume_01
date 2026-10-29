import React from 'react';

export function ScoreBadge({ score, size = 'md' }) {
  const num = Math.round(Number(score) || 0);

  let colorClasses = 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
  let label = 'Needs Work';

  if (num >= 80) {
    colorClasses = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    label = 'ATS Ready';
  } else if (num >= 65) {
    colorClasses = 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800';
    label = 'Competitive';
  } else if (num >= 50) {
    colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    label = 'Moderate';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colorClasses} ${sizeClasses}`}>
      <span className="font-bold">{num}/100</span>
      <span>•</span>
      <span>{label}</span>
    </span>
  );
}

export function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const spinnerSize = size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
      <div className={`${spinnerSize} border-3 border-slate-200 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin`} />
      {message && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full ${maxWidth} bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

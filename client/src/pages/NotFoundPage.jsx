import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-navy-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-inner">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-sky-400">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            The resume report or application view you requested does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 flex items-center justify-center gap-2 shadow"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 flex items-center justify-center gap-2 shadow"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          )}

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  Briefcase,
  Sparkles,
  History,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/upload', label: 'Upload & Parse Resume', icon: UploadCloud },
    { to: '/jd-match', label: 'Job Description Matcher', icon: Briefcase },
    { to: '/suggestions', label: 'AI Bullet Improver', icon: Sparkles },
    { to: '/history', label: 'Analysis History', icon: History },
    { to: '/profile', label: 'Profile & Settings', icon: UserCheck },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800 p-4 min-h-[calc(100vh-4rem)] no-print transition-colors">
      {/* User Quick Info */}
      <div className="p-3.5 mb-6 rounded-xl bg-gradient-to-br from-slate-50 to-brand-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || 'Candidate'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.targetRole || 'Software Engineer'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Core Modules
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Placement Preparation Tips Card */}
      <div className="mt-8 p-4 rounded-xl bg-sky-50 dark:bg-slate-800/50 border border-sky-100 dark:border-slate-700/80 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300 mb-1">
          <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          Placement Pro Tip
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Aim for an ATS score above <strong>80+</strong> by quantifying project impacts with numbers and action verbs.
        </p>
      </div>
    </aside>
  );
}

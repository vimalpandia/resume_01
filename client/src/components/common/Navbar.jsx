import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sun,
  Moon,
  LayoutDashboard,
  Upload,
  Briefcase,
  Sparkles,
  History,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, authRequired: true },
    { label: 'Upload & Parse', path: '/upload', icon: Upload, authRequired: true },
    { label: 'JD Matcher', path: '/jd-match', icon: Briefcase, authRequired: true },
    { label: 'AI Improver', path: '/suggestions', icon: Sparkles, authRequired: true },
    { label: 'History', path: '/history', icon: History, authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-sky-600 dark:from-white dark:via-sky-300 dark:to-brand-400 bg-clip-text text-transparent">
                Resume Analyzer
              </span>
              <span className="ml-1 text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-sky-300">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })
            ) : (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-sky-400"
                >
                  Features
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-sky-400"
                >
                  ATS Engine
                </Link>
              </>
            )}
          </div>

          {/* Right Action Icons: Theme Toggle & User Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-sky-400 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-sky-500 text-white flex items-center justify-center font-bold text-xs shadow">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || 'My Account'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-sky-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 rounded-lg shadow-sm shadow-brand-500/30 transition-all hover:scale-[1.02]"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 px-4 pt-2 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-sm">{user?.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                </div>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Icon className="w-5 h-5 text-brand-500" />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="w-5 h-5 text-brand-500" />
                Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

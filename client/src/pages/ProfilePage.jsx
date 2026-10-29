import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Briefcase,
  Key,
  Sun,
  Moon,
  Trash2,
  ShieldAlert,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Software Engineer');
  const [customApiKey, setCustomApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile({
        name,
        targetRole,
        customApiKey,
        themePreference: theme,
      });

      if (res.success && res.user) {
        updateUser(res.user);
        addToast('Profile settings saved successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'WARNING: This will permanently delete your account and all associated resume audit records. Type "DELETE" to confirm:'
    );

    if (confirmation !== 'DELETE') {
      addToast('Account deletion cancelled', 'info');
      return;
    }

    setDeleting(true);
    try {
      await authService.deleteAccount();
      addToast('Account permanently deleted', 'info');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Error deleting account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-sky-400 mb-1">
            <User className="w-4 h-4" />
            Candidate Settings & Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Profile & Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal placement target, API integration keys, and visual appearance.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information Form */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              General Candidate Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Role Domain
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                  <option value="Frontend React Developer">Frontend React Developer</option>
                  <option value="Backend Systems Engineer">Backend Systems Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Visual Appearance & Theme Settings */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Appearance & Interface Theme
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Switch between daylight high-contrast and sleek midnight dark mode.
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => isDark && toggleTheme()}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  !isDark
                    ? 'border-brand-500 bg-brand-50/60 shadow-sm font-bold text-brand-700'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => !isDark && toggleTheme()}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  isDark
                    ? 'border-brand-500 bg-brand-950/40 shadow-sm font-bold text-sky-400'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Moon className="w-5 h-5 text-sky-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* AI Configuration Section */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              AI Provider Integration (Optional)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              The application works 100% out-of-the-box using the built-in Heuristic Engineering Engine. To enable live Google Gemini API generative output, you may supply a custom API key:
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Gemini API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5">
                  Keys are stored securely and never transmitted to third parties or client logs.
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-rose-900/40">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-base mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3>Danger Zone: Account & Data Deletion</h3>
            </div>
            <p className="text-xs text-rose-800/80 dark:text-rose-300/80 mb-6 leading-relaxed">
              Permanently delete your profile, authentication credentials, and all uploaded resume analyses from the database. This action is irreversible.
            </p>

            <button
              type="button"
              disabled={deleting}
              onClick={handleDeleteAccount}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting Account...' : 'Permanently Delete Account & All Data'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

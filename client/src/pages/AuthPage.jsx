import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthPage({ defaultMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Full Stack Software Engineer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, register, demoLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isLogin && (!formData.name || formData.name.trim().length < 2)) {
      setFormError('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please provide a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        addToast('Welcome back! Successfully signed in.', 'success');
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.targetRole
        );
        addToast('Account created successfully!', 'success');
      }
      navigate(redirectPath);
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please verify credentials.');
      addToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setFormError('');
    try {
      await demoLogin();
      addToast('Signed in as Placement Reviewer Demo User!', 'success');
      navigate(redirectPath);
    } catch (err) {
      setFormError('Demo login error: ' + err.message);
      addToast(err.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-navy-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/20 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Sign in to your account' : 'Create your candidate account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account yet? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormError('');
              }}
              className="font-semibold text-brand-600 dark:text-sky-400 hover:underline"
            >
              {isLogin ? 'Sign up free' : 'Sign in here'}
            </button>
          </p>
        </div>

        {/* 1-Click Placement Demo Button */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all shadow-sm"
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>1-Click Placement Reviewer Demo Login</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-navy-900 px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Or continue with email
          </span>
        </div>

        {/* Error message */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-medium">
            {formError}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aditya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aditya@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                >
                  <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                  <option value="Frontend React Developer">Frontend React Developer</option>
                  <option value="Backend Systems Engineer">Backend Systems Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 shadow-md shadow-brand-500/30 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secure JWT Authentication • Bcrypt Password Hashing</span>
        </div>
      </div>
    </div>
  );
}

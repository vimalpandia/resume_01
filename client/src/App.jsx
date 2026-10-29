import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ReportPage from './pages/ReportPage';
import JdMatchPage from './pages/JdMatchPage';
import SuggestionsPage from './pages/SuggestionsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { LoadingSpinner } from './components/common/UIComponents';

// Route Guard for Protected Dashboard Views
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950">
        <LoadingSpinner message="Checking authentication session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
              <Navbar />
              <div className="flex-1 flex flex-col">
                <Routes>
                  {/* Public Landing & Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<AuthPage defaultMode="login" />} />
                  <Route path="/register" element={<AuthPage defaultMode="register" />} />

                  {/* Protected SaaS Core Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <UploadPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/report/:id"
                    element={
                      <ProtectedRoute>
                        <ReportPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jd-match"
                    element={
                      <ProtectedRoute>
                        <JdMatchPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jd-match/:id"
                    element={
                      <ProtectedRoute>
                        <JdMatchPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/suggestions"
                    element={
                      <ProtectedRoute>
                        <SuggestionsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/suggestions/:id"
                    element={
                      <ProtectedRoute>
                        <SuggestionsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

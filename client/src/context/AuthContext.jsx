import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          authService.logout();
        }
      } catch (err) {
        console.warn('Authentication session check:', err.message);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password, targetRole) => {
    const res = await authService.register({ name, email, password, targetRole });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const demoLogin = async () => {
    return login('demo@resumepro.dev', 'Demo@1234');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { ROLES } from '../types';
import { mockBackend } from '../services/mockBackend';
import { getAuthToken, setAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

const STORAGE_USER_KEY = 'sepm_current_user_profile';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Initialize or verify session
  useEffect(() => {
    async function initAuth() {
      try {
        const token = getAuthToken();
        if (token && user) {
          // If we have token and saved user, optionally re-verify
          // setUser(user);
        }
      } catch {
        setUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  // Save user changes to local storage
  const persistUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.user) {
      persistUser(res.user);
    }
    return res;
  };

  const registerStudent = async (studentData) => {
    const res = await authService.registerStudent(studentData);
    if (res.user) {
      persistUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    persistUser(null);
  };

  const updateUserProfile = async (updateData) => {
    if (!user) return;
    const res = await userService.updateUser(user.id, updateData);
    if (res.data) {
      persistUser(res.data);
    }
    return res;
  };

  /**
   * Fast Demo Persona Switcher (Convenient for Pair-Programming & Evaluation)
   * Switches to corresponding pre-seeded user instantly
   */
  const switchDemoRole = async (targetRole) => {
    const db = mockBackend.getDb();
    const targetUser = db.users.find((u) => u.role === targetRole && u.status === 'ACTIVE');
    if (targetUser) {
      const mockToken = `mock-jwt-token-${targetUser.id}-${Date.now()}`;
      setAuthToken(mockToken);
      persistUser(targetUser);
      return targetUser;
    }
    return null;
  };

  const role = user?.role || null;
  const isAuthenticated = Boolean(user && user.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        login,
        registerStudent,
        logout,
        updateUserProfile,
        switchDemoRole,
        isStudent: role === ROLES.STUDENT,
        isOrganizer: role === ROLES.ORGANIZER,
        isAdmin: role === ROLES.ADMIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

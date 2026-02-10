
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  const login = (data) => {
    const { token, role, name, userId } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role || 'tenant');
    localStorage.setItem('userName', name || '');
    localStorage.setItem('userId', userId || '');
    setToken(token);
    setRole(role || 'tenant');
    setUserName(name || '');
    setUserId(userId || '');
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserName(null);
    setUserId(null);
    window.location.reload(); // Reload to clear all app state
  };

  const value = { token, role, userName, userId, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

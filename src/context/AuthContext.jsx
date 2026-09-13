import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored authentication session on startup
    const storedToken = localStorage.getItem('@EduBlog:token');
    const storedUser = localStorage.getItem('@EduBlog:user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('@EduBlog:token');
        localStorage.removeItem('@EduBlog:user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('@EduBlog:token', receivedToken);
    localStorage.setItem('@EduBlog:user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('@EduBlog:token');
    localStorage.removeItem('@EduBlog:user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isTeacher = user?.role === 'professor' || user?.role === 'administrador';
  const isAdmin = user?.role === 'administrador';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isTeacher,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

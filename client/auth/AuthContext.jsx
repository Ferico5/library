/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/auth', { email, password });

      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return response;
      }
    } catch (error) {
      if (error.response) {
        return error.response;
      }
      return { data: { msg: 'Server error' } };
    }
  };

  const logout = (navigate) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth')
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

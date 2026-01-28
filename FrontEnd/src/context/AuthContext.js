import React, { createContext, useState, useContext, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(
    !!localStorage.getItem("token"),
  );
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    // if (token && !user) {
    //   verifyToken();
    // }
    const role = localStorage.getItem('role');
    if (token && !user && role === 'user') {
      verifyToken();   // only users call /auth/me
    } else if (!token) {
      setIsVerifying(false);
    }
  }, [token, user]);

  const verifyToken = async () => {
    try {
      setIsVerifying(true);
      const response = await authApi.getMe();
      setUser(response.data.user);
    } catch (err) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = isAdmin
        ? await authApi.adminLogin({ email, password })
        : await authApi.userLogin({ email, password });

      //const { token: newToken, user: userData } = response.data;
      const { token: newToken, user, admin } = response.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem('role', (user || admin).role);
      setUser(user || admin);
      //setUser(userData);
      setToken(newToken);
      setIsVerifying(false);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name,
    email,
    password,
    confirmPassword,
    isAdmin = false,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = isAdmin
        ? await authApi.adminSignup({ email, password, confirmPassword })
        : await authApi.userSignup({ name, email, password, confirmPassword });

      //const { token: newToken, user: userData } = response.data;
      const { token: newToken, user, admin } = response.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem('role', (user || admin).role);
      setUser(user || admin);
      //setUser(userData);
      //setUser(user || admin); // adminSignup returns `admin`, userSignup returns `user`
      setToken(newToken);
      setIsVerifying(false);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem('role'); 
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isVerifying,
        error,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

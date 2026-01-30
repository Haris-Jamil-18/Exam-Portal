import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isVerifying } = useAuth();

  // Show loading while verifying authentication
  if (isVerifying) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  // if (!isAuthenticated) {
  //   // Redirect to appropriate login based on required role
  //   return <Navigate to={requiredRole === 'admin' ? '/admin/dashboard' : '/dashboard'} />;
  // }

  if (!isAuthenticated) {
    return (
      <Navigate to={requiredRole === "admin" ? "/admin/login" : "/login"} />
    );
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
      />
    );
  }

  return children;
};

export default PrivateRoute;

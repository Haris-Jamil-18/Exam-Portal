import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Navigation.css';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {isAuthenticated && user?.role === 'admin' ? (
          <Link to="/admin/dashboard" className="navbar-logo">
            📚 Exam Portal
          </Link>
        ) : (
          <Link to="/" className="navbar-logo">
            📚 Exam Portal
          </Link>
        )}

        
<div className="nav-menu">
  {isAuthenticated ? (
    <>
      <span className="user-name">Welcome, {user?.name}</span>
      {/* ... existing authenticated links ... */}
      <button onClick={handleLogout} className="nav-link logout-btn">
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="nav-link login-primary">
        User
      </Link>
      <Link to="/admin/login" className="nav-link admin-link">
        Admin Login
      </Link>
    </>
  )}
</div>
      </div>
    </nav>
  );
};

export default Navigation;

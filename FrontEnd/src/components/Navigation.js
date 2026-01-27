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
              
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link">
                  Admin Dashboard
                </Link>
              )}
              
              {user?.role === 'user' && (
                <>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/results" className="nav-link">
                    Results
                  </Link>
                </>
              )}

              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                User Login
              </Link>
              <Link to="/signup" className="nav-link">
                User Signup
              </Link>
              <Link to="/admin/login" className="nav-link">
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

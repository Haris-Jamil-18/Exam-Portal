import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect admins to admin dashboard
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  // Redirect regular users to dashboard
  if (isAuthenticated && user?.role === 'user') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Exam Portal</h1>
        <p>Take exams online and track your progress</p>


        
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">
            User
          </Link>
          <Link to="/admin/login" className="btn-secondary">
            Admin Login
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📝 Take Exams</h3>
            <p>Take multiple choice and descriptive exams online</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track Results</h3>
            <p>View your scores and progress across all exams</p>
          </div>
          <div className="feature-card">
            <h3>⏱️ Timed Exams</h3>
            <p>Manage time with real-time countdown timer</p>
          </div>
          <div className="feature-card">
            <h3>👨‍💼 Admin Panel</h3>
            <p>Create and manage exams with ease</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

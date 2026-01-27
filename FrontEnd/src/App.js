import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Navigation from './components/Navigation';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSignupPage from './pages/AdminSignupPage';
import DashboardPage from './pages/DashboardPage';
import ExamPage from './pages/ExamPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ResultsPage from './pages/ResultsPage';

// Components
import EditExam from './components/Admin/EditExam';

import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/exam/:id" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin/exam/:id" element={<PrivateRoute requiredRole="admin"><EditExam /></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

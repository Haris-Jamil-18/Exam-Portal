import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Navigation from './components/Navigation';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './components/Auth/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ExamPage from './pages/ExamPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ResultsPage from './pages/ResultsPage';
import AdminExamResults from './components/Admin/AdminExamResults';

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
          <Route path="/login" element={<AuthPage initialIsSignup={false} />} />
          <Route path="/signup" element={<AuthPage initialIsSignup={true} />} />
          <Route path="/admin/login" element={<AuthPage isAdmin={true} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/exam/:id" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin/exam/:id" element={<PrivateRoute requiredRole="admin"><EditExam /></PrivateRoute>} />
          <Route path="/admin/exam/:id/results" element={<AdminExamResults />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

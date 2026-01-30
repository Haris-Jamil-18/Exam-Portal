import React from 'react';
import Login from '../components/Auth/Login';

const AdminLoginPage = () => {
  return <Login isAdmin={true} />;
};

export default AdminLoginPage;

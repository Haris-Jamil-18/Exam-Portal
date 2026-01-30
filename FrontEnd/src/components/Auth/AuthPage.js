/* src/components/Auth/AuthPage.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Updated path
import './AuthPage.css'; // Ensure the CSS file is in the same folder

const AuthPage = ({ initialIsSignup = false, isAdmin = false }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialIsSignup);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth(); //
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, isAdmin); //
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard'); //
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed'); //
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match'); //
    try {
      await signup(name, email, password, confirmPassword, isAdmin); //
      navigate('/dashboard'); //
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed'); //
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>{isAdmin ? 'Admin Sign In' : 'Sign In'}</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>
            {!isAdmin && (
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start your journey with us</p>
                <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
              </div>
            )}
            {isAdmin && (
              <div className="overlay-panel overlay-right">
                <h1>Admin Portal</h1>
                <p>Please use your credentials to access the dashboard</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
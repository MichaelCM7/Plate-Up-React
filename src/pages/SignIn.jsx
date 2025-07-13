import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import '../styles/SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Consolidated error state
  const [message, setMessage] = useState(''); // For success messages, e.g., password reset
  const [isLoading, setIsLoading] = useState(false);

  const { login, resetPassword } = useAuth(); // Get login and resetPassword from AuthContext
  const navigate = useNavigate();


  const validateInputs = () => {
    let isValid = true;
    if (!email) {
      setError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid.');
      isValid = false;
    }
    if (!password) {
      if (isValid) setError('Password is required.');
      isValid = false;
    }
    return isValid;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); 
    setMessage('');

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/Home'); 
    } catch (err) {
      console.error('Sign in error:', err);
      // Handle specific Firebase authentication errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else {
        setError('Failed to sign in. Please check your credentials or try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setMessage(''); // Clear previous messages

    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email); // Use the resetPassword function from AuthContext
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Failed to send password reset email. Please check the email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    setError(`${provider} sign-in not yet implemented with Firebase. Please use email/password.`);
    
  };

  return (
    <div className="signin-container">
     
      <div className="animated-bg"></div>
      
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <div className="container">
        <div className="signin-card">
          <div className="logo">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {/* Display error or success messages */}
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSignIn}> {/* Use form and onSubmit */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  className={`form-control ${error && email ? 'error' : ''}`} 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  aria-describedby={error && email ? "email-error" : undefined}
                />
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              </div>
    
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  className={`form-control ${error && password ? 'error' : ''}`}  
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  aria-describedby={error && password ? "password-error" : undefined}
                />
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/reset-password" onClick={handleForgotPassword}>Forgot your password?</Link> 
            </div>

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn google-btn" onClick={() => handleSocialSignIn('Google')}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                <svg viewBox="0 0 24 24" style={{width: '18px', height: '18px'}}>
                  <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{fontSize: '10px', fontWeight: '600'}}>Google</span>
              </div>
            </button>
            
            <button className="social-btn microsoft-btn" onClick={() => handleSocialSignIn('Microsoft')}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                <svg viewBox="0 0 24 24" style={{width: '18px', height: '18px'}}>
                  <path fill="#f25022" d="M0 0h11v11H0z"/>
                  <path fill="#00a4ef" d="M13 0h11v11H13z"/>
                  <path fill="#7fba00" d="M0 13h11v11H0z"/>
                  <path fill="#ffb900" d="M13 13h11v11H13z"/>
                </svg>
                <span style={{fontSize: '10px', fontWeight: '600'}}>Microsoft</span>
              </div>
            </button>
            
            <button className="social-btn apple-btn" onClick={() => handleSocialSignIn('Apple')}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px'}}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span style={{fontSize: '10px', fontWeight: '600'}}>Apple</span>
              </div>
            </button>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/Sign-Up">Sign up here</Link> {/* Use Link */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {db} from '../firebaseConfig';
import {doc, setDoc} from 'firebase/firestore';

import "../styles/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0); //For password
  const [isSubmitting, setIsSubmitting] = useState(false); //for submitting
  const [error, setError] = useState('');  //For error message
  const [message , setMessage] = useState('') //For success message
  
  //UseNavigate hook
  const navigate = useNavigate(); //Initialises useNavigate

  const {signup} = useAuth(); //Getting the signup function
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update password strength when password changes
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; //Special characters
    return Math.min(strength, 5);
  };

  
  const getStrengthClass = (strength) => {
    switch (strength) {
      case 1:
        return 'strength-weak';
      case 2:
        return 'strength-fair';
      case 3:
        return 'strength-good';
      case 4:
        return 'strength-strong'; 
      case 5:
        return 'strength-very-strong'; 
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //Will prevent the page from reloading

    setError('');
    setMessage('');

    if(formData.password != formData.confirmPassword){
      setError("Passwords do not match");
      return;
    }

    try{
      setIsSubmitting(true); //Submission preveneted before all data is enetered

      //Aunthentication with Firebase
      const userCredential = await signup(formData.email, formData.password);
      const user= userCredential.user;

      //Storing extra data about user in firestore
      await setDoc(doc(db , 'users', user.uid),{
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date()
      });

      setMessage('Acount created successfully!');
      //To quiz page after sign-up
      navigate('/Quiz');

    } catch (err){
      console.error("Failed to create an account: ", err);

      //Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setIsSubmitting(false); //You can submit
    }

  };

  const simulateAuthAction = (provider) => {
    alert(`Signing up with ${provider}...`);
  };

  const signInWithGoogle = () => {
    simulateAuthAction('Google');
  };

  const signInWithMicrosoft = () => {
    simulateAuthAction('Microsoft');
  };

  const signInWithApple = () => {
    simulateAuthAction('Apple');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
          <div className="website-name" style={{ color: `#00d2a0`, fontWeight: '700', fontSize: '2.2rem' }}>
            PLATE UP
          </div>
          <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '60px', width: '60px' }} />
        </div>
        
        <h1 style={{color: `#00d2a0`}}>SIGN UP</h1>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        
        <div id="signupForm">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <div className="password-strength">
                <div 
                  className={`password-strength-bar ${getStrengthClass(passwordStrength)}`}
                  id="strengthBar"
                  style={{ width: passwordStrength === 0 ? '0%' : undefined }}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
          </form>
        </div>
        
        <div className="social-buttons">
          <div className="social-btn google-btn" onClick={signInWithGoogle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ fontSize: '10px', fontWeight: '600' }}>Google</span>
            </div>
          </div>
          
          <div className="social-btn microsoft-btn" onClick={signInWithMicrosoft}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                <path fill="#f25022" d="M0 0h11v11H0z"/>
                <path fill="#00a4ef" d="M13 0h11v11H13z"/>
                <path fill="#7fba00" d="M0 13h11v11H0z"/>
                <path fill="#ffb900" d="M13 13h11v11H13z"/>
              </svg>
              <span style={{ fontSize: '10px', fontWeight: '600' }}>Microsoft</span>
            </div>
          </div>
          
          <div className="social-btn apple-btn" onClick={signInWithApple}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span style={{ fontSize: '10px', fontWeight: '600' }}>Apple</span>
            </div>
          </div>
        </div>
        
        <div className="footer-links">
          <p>Already have an account? <Link to="/Sign-In">Sign In</Link></p>
          <Link to="/">Return to Home Page</Link>
        </div>
      </div> 
    </div> 
  );
};

export default SignUp;
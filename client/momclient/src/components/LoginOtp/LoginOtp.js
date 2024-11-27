import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './LoginOtp.css';
import loginimage from '../../images/Secure login-pana.png';
import googleimg from '../../images/google_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithOtp } from '../../utils/api';
import { validateField } from '../../validation/validate';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import { useGoogleLogin } from '@react-oauth/google';
import {googleAuth} from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const LoginOtp = () => {

    const navigate = useNavigate();
  // State to manage form values, touched fields, and errors
  const [formValues, setFormValues] = useState({ email: '' });
  const [touched, setTouched] = useState({ email: false }); // Track touched fields
  const [errors, setErrors] = useState({ email: '' }); // Validation errors
  const [isLoading, setIsLoading] = useState(false); // Track if the OTP is being sent

  const { login } = useAuth();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        const result = await googleAuth(authResult['code']);
        
        if (result.data.success) {        
          toast.success(result.data.message);
          const token = result.data.data.token;
          localStorage.setItem('auth-token', token);
        // Update user context here
        const { role, name, profilePicture } = result.data.data.user;
        login({ token, username: name, role: role, picture: profilePicture });
        role === 'admin' ? navigate('/admin-dashboard') : role === 'user' ? navigate('/user-dashboard') : alert('Invalid role');
        } else {
          toast.error(result.data.message || 'User not found');
        } 
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });


  // Function to set the touched state when a field is focused
  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle validation based on field and value
  const handleValidation = (field, value) => {
    const error = validateField(field, value, touched[field]);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

    // Handle input change and validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        handleValidation(name, value); // Validate the field on input change
    };

  // Submit form and send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Set all fields as touched when submitting
    setTouched({ email: true });
    handleValidation('email', formValues.email);

    // Only send OTP if no errors
    if (!errors.email && formValues.email) {
        setIsLoading(true);

        try {
            const response = await loginWithOtp(formValues.email);
            toast.success(response.message);
    
            // Reset form values
            setFormValues({ email: '' });
            navigate('/verify-otp', { state: { email: formValues.email } });
          } catch (err) {
            toast.error(err.message);
            setFormValues({ email: '' });
            setErrors({});
          } finally {
            setIsLoading(false); // Stop loading
          }
    } 
  };

  return (
      <div className="form-container d-flex gap-4">
        <form className="login-form">
        {/* <div className="logo">
        <img src={logoimage} alt="Logo" />
        </div> */}
          <div className="form-text">
            <h2>Welcome to Meeting Plus</h2>
            <p className="heading-text">
              Enter your email id to log in to your account
            </p>
          </div>
          <h5 className="form-label mb-e">Email <span>*</span></h5>
          <div className="mb-3">
          <TextField
              id="email"
              placeholder="Type Your Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formValues.email}
              onFocus={() => handleFocus('email')} // Focus handler
              onChange={handleInputChange} // Change handler
              error={!!errors.email} // Corrected to check for errors.email
              helperText={errors.email} // Corrected to show the error message for email
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            </div>
            <div className="text-center">
            <button
              type="button"
              className="signin-btn1"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            </div>

          <div className="or">or</div>
          <button className="signin-btn2"><Link to="/user-login">Sign In With Password</Link></button>
          <div className="set-pwd">
          Don't have an account ? <Link to="/signup">Sign Up</Link>
          </div>
          <div className="or or-2">Or continue with</div>
          <button type="button" className="google-signin-btn" onClick={googleLogin}>
            <img src={googleimg} alt="Logo" />Sign In with Google</button>
        </form>

        <div className="login-image">
          <img src={loginimage} alt="Logo" />
        </div>
      </div>
  );
};

export default LoginOtp;

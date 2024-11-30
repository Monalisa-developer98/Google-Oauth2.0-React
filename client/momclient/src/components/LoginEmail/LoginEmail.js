import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './LoginEmail.css';
import loginimage from '../../images/Secure login-pana.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import { loginWithPassword, loginWithOtp } from '../../utils/api';
import { validateField } from '../../validation/validate';
import { useAuth } from '../../context/AuthContext';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from '@mui/material/CircularProgress';

const LoginEmail = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({email: '', password: ''});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);   // loading state

    const { login } = useAuth();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
      handleValidation(name, value);
    };

    const handleValidation = (field, value) => {
      const error = validateField(field, value, touched[field]);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };
  
    const handleBlur = (e) => {
      const { name } = e.target;
      setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    };

    // forgot password functionality
    const handleForgotPassword = async (e) => {
      e.preventDefault();
      const { email } = formValues;

      setIsLoading(true);   // set loading state to true
 
      try {
        const response = await loginWithOtp(email);
        if (response.success) {
          toast.success('OTP sent successfully to your email.');
          setTimeout(() => {
            navigate('/reset-password', { state: { email: email } });
          }, 3000);
        } else {
          toast.error(response.message || 'Failed to send OTP.');
        }
      } catch (error) {
        toast.error(error.message || 'Error occurred while sending OTP.');
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };


// form submit to login
    const handleLogin = async (e) => {
      e.preventDefault();
      const { email, password } = formValues; 

  // Mark all fields as touched
  const touchedFields = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);

    // Validate all fields
    Object.keys(formValues).forEach((field) => {
      handleValidation(field, formValues[field]);
    });

  // Check if there are any validation errors
  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const allFieldsFilled = Object.keys(formValues).every((key) => formValues[key]);
      
      if (!hasErrors && allFieldsFilled ) {
        setIsLoading(true); // Set loading to true

      setTimeout(async () => {
      try {
        const response = await loginWithPassword(email, password);
        if (response.success) {
          toast.success(response.message);

          const { token, userData, profilePicture } = response.data; // Extract token, profilePicture and user-data from response
          // console.log('User Data:', userData);
          login({ token, username: userData.name, role: userData.role, picture: userData.profilePicture || profilePicture });
                  
            if (userData.role === 'admin') {
              navigate('/admin-dashboard');
            } else if (userData.role === 'user') {
              navigate('/user-dashboard');
            } else {
              alert('Invalid role');
            }
        } else {
          toast.error(response.message);
          setFormValues({ email: '', password: '' });
          setErrors({});
        }
      } catch (error) {
        toast.error(error.message);
        setFormValues({ email: '', password: '' });
        setErrors({});
      } finally {
        setIsLoading(false); // Reset loading state
      }
    }, 2000);
  }  
};

  return (
        <div className="form-container d-flex gap-4">
        <form className="login-form" onSubmit={handleLogin}>

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
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            </div>

        <h5 className="form-label mb-e">Password <span>*</span></h5>
        <div className="mb-3">
          <TextField
              id="password"
              placeholder="Type Your Password"
              variant="outlined"
              fullWidth
              name="password"
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}   
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            </div>
            <div className="form-options mb-4 d-flex justify-content-between">
                {/* <div className="remember-me"><label><input type="checkbox" name="rememberMe"/>Remember Me</label></div> */}
                <div className="forgot-password"> <button type="button" onClick={handleForgotPassword} disabled={isLoading} className='forgot-btn'>Forgot Password?</button>
            </div>
            </div>
            <div className="text-center">
                    <button type="submit" className="signin-btn1" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                    </button>
                </div>

                


          <div className="or">Don't have an account ?</div>
          <div className="set-pwd signin-btn2">
            <Link to="/signup">Sign Up</Link>
          </div>
        </form>

        <div className="login-image">
          <img src={loginimage} alt="Logo" />
        </div>
      </div>
  )
}

export default LoginEmail

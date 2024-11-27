import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './ForgotPassword.css';
import loginimage from '../../images/Secure login-pana.png';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../utils/api';
import { validateField } from '../../validation/validate';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { email } = location.state || {}; // getting email from LoginEmail component
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically focus the next input
      if (value && index < otp.length - 1) {
        const nextInput = document.querySelector(`#otp-${index + 1}`);
        nextInput?.focus();
      }

      if (value) {
        setErrors((prevErrors) => ({ ...prevErrors, otp: '' }));
      }

    }
  };

  // Mark a field as touched for validation
  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Perform validation on a specific field
  const handleValidation = (field, value) => {
    let error = '';
    if (field === 'confirmPassword' && value !== password) {
      error = "Passwords don't match";
    } else{
      error = validateField(field, value, touched[field]);
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  // Handle the password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Collect form values
    const formValues = {
      otp: otp.join(''),
      password,
      confirmPassword,
    };

    // Mark all fields as touched
    const touchedFields = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);

    // Clear previous errors before re-validating
    setErrors({});

    // Validate all fields
    Object.keys(formValues).forEach((field) => {
      handleValidation(field, formValues[field]);
    });

    // Check if there are any validation errors
    const hasErrors = Object.keys(errors).some((key) => errors[key]);
    const allFieldsFilled = Object.keys(formValues).every((key) => formValues[key]);

    if (!hasErrors && allFieldsFilled) {
      setIsUpdating(true);
      try {
        const response = await resetPassword(email, formValues.otp, password, confirmPassword);
        if (response.success) {
          toast.success(response.message);
          setTimeout(() => {
            setIsUpdating(false);
            navigate('/');
          }, 1000);
        } else {
          toast.error(response.message || 'Password reset failed.');
          setIsUpdating(false);
        }
      } catch (error) {
        toast.error(error.message || 'Error occurred while resetting password.');
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="form-container d-flex gap-4">
      <form className="login-form" onSubmit={handlePasswordReset}>
        <div className="form-text">
          <h2>Welcome to Meeting Plus</h2>
          <p className="heading-text">Set Password</p>
        </div>

        <div className="form-group">
          <label className="mb-3">
            Enter Your 6-Digit OTP <span>*</span>
          </label>
          <div className="otp-inputs d-flex mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onFocus={() => handleFocus('otp')}
                className="otp-digit"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="error-text">{errors.otp}</p> // Show OTP error here
          )}
        </div>

        <h5 className="form-label mb-e">Password <span>*</span></h5>
        <div className="mb-3">
          <TextField
            id="password"
            placeholder="Type Your Password"
            variant="outlined"
            fullWidth
            value={password}
            onFocus={() => handleFocus('password')}
            onChange={(e) => {
              setPassword(e.target.value);
              handleValidation('password', e.target.value);
            }}
            error={!!errors.password}
            helperText={errors.password}
          />
        </div>

        <h5 className="form-label mb-e">Confirm Password <span>*</span></h5>
        <div className="mb-5">
          <TextField
            id="confirmPassword"
            placeholder="Re-enter Your Password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              handleValidation('confirmPassword', e.target.value);
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </div>

        <div className="text-center">
          <button type="submit" className="signin-btn1">
          {isUpdating ? 'Updating...' : 'Reset Password'}
          </button>
        </div>
      </form>

      <div className="login-image">
        <img src={loginimage} alt="Login Illustration" />
      </div>
    </div>
  );
};

export default ForgotPassword;

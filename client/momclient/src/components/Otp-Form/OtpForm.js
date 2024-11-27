import React, { useState, useRef } from 'react';
import './OtpForm.css';
import loginimage from '../../images/Secure login-pana.png';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateField } from '../../validation/validate';
import { verifyLoginOtp, resendOtp } from '../../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Getting email from state passed during navigation
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState(Array(6).fill(''));

  const { login } = useAuth();

  // Function to handle input focus for OTP input fields
  // const handleInputFocus = (e, index) => {
  //   if (e.target.value && index < 5) {
  //     const nextSibling = e.target.nextElementSibling;
  //     if (nextSibling) {
  //       nextSibling.focus();
  //     }
  //   } else if (e.target.value === '' && index > 0) {
  //     const prevSibling = e.target.previousElementSibling;
  //     if (prevSibling) {
  //       prevSibling.focus();
  //     }
  //   }
  // };

  const otpRefs = useRef([]);

  // Update OTP input fields
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      const otpCode = newOtp.join('');
      const otpErrors = newOtp.map((digit, idx) => validateField('otp', otpCode, true)); 
      setErrors(otpErrors);

      if (value !== '' && index < 5 && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
     
      if (value === '' && index > 0 && otpRefs.current[index - 1]) {
        otpRefs.current[index - 1].focus();
      }
      // handleInputFocus(e, index);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsVerifying(true);

    const otpCode = otp.join(''); 

    const otpErrors = otp.map((digit, index) => validateField('otp', otpCode, true));
    setErrors(otpErrors);

    if (otpErrors.some((error) => error !== '')) {
      setIsVerifying(false);
      return;
    }

    setTimeout(async () => {
      try {
        const response = await verifyLoginOtp(email, otpCode);

        if (response.success) {
          toast.success(response.message);
          const { token, otpRecord } = response.data;

          setOtp(Array(6).fill(''));
          setErrors(Array(6).fill(''));

          login({ token, username: otpRecord.name, role: otpRecord.role });


          if (otpRecord.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (otpRecord.role === 'user') {
            navigate('/user-dashboard');
          } else {
            alert('Invalid role');
          }
        } else {
          setOtp(Array(6).fill(''));
          setErrors(Array(6).fill(''));
          throw new Error(response.message || 'Verification failed');
        }
      } catch (error) {
        toast.error(error.message || 'Error verifying OTP');
        setOtp(Array(6).fill(''));
        setErrors(Array(6).fill(''));
      } finally {
        setIsVerifying(false);
      }
    }, 2000);
  };


    // Function to handle Resend OTP
    const handleResendOtp = async () => {
      setIsResending(true);
    
      try {
        setOtp(Array(6).fill(''));
        setErrors(Array(6).fill(''));
    
        setTimeout(async () => {
          const response = await resendOtp(email);
    
          if (response.success) {
            toast.success('OTP resent successfully!');
          } else {
            toast.error(response.message || 'Failed to resend OTP');
          }
        }, 1000); 
      } catch (error) {
        toast.error(error.message || 'Error resending OTP');
      } finally {
        setIsResending(false);       
      }
    };


  return (
      <div className="form-container d-flex gap-4">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-text">
            <h2>Welcome to Meeting Plus</h2>
            <p className="heading-text">Enter your OTP to log in to your account</p>
          </div>

          <div className="form-group otp-form">
            <label className="mb-3">
              Enter Your 6 Digit OTP <span>*</span>
            </label>
            <div className="pincode d-flex">
              {otp.map((digit, index) => (
                <div className="digit" key={index}>
                  <input
                    type="text"
                    value={digit}
                    maxLength="1"
                    onChange={(e) => handleOtpChange(e, index)}
                    // onInput={(e) => handleInputFocus(e, index)}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="error-container">
            {errors.some((error) => error !== '') && (
              <p className="helper-text">Please enter a 6-digit otp</p>
            )}
          </div>
          </div>

          <div className='resend-otp'> Otp not Received? {' '}<button type="button" className="resend-btn" onClick={handleResendOtp}
          disabled={isResending}
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
          </div>

          <button type="submit" className="signin-btn1"> {isVerifying ? 'Verifying...' : 'Verify'} </button>
        </form>

        <div className="login-image">
          <img src={loginimage} alt="Secure login illustration" />
        </div>
      </div>
  );
};

export default OtpForm;

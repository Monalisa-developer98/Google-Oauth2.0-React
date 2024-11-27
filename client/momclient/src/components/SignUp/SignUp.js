import React, { useState } from 'react';
import './SignUp.css';
import { Stepper, Step, StepLabel, Button, TextField, Box, CircularProgress } from '@mui/material';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginimage from '../../images/Secure login-pana.png';
import { createUser, requestOtp, verifyOtp, googleAuthRegister } from '../../utils/api';  // Added verifyOtp import
import { useNavigate } from 'react-router-dom';
import { validateField } from '../../validation/validate';
import { InputAdornment } from '@mui/material';
import googleimg from '../../images/google_icon.png';
import { useGoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false); // Track email validity
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP has been requested
  const [emailVerified, setEmailVerified] = useState(false); // Track if email has been verified
  const [isOtpSending, setIsOtpSending] = useState(false); // Track if OTP is being sent
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);


  const steps = ['Name & Email', 'Phone & Address', 'Set Password'];


  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        const result = await googleAuthRegister(authResult['code']);

        if (result.data.success) {
          toast.success(result.data.message || "Sign up successful!");
          navigate('/');
        } else {
          toast.error(result.data.message || "Sign up failed!");
        }
      }
    } catch (err) {
      console.error("Google Sign-Up Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const googleRegister = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });

  const handleNext = () => {
    const currentStepFields = getStepFields(activeStep);
    let hasErrors = false;

    // Validate current step fields
    const newErrors = { ...errors };
    currentStepFields.forEach((field) => {
      const error = validateField(field, formValues[field], true);
      newErrors[field] = error;
      if (error) hasErrors = true;
    });

    // Check if OTP is verified when on Step 0 and OTP is requested
    if (activeStep === 0) {
      if (otpRequested && !emailVerified) {
        newErrors.otp = 'Please verify the OTP before proceeding.';
        hasErrors = true;
      } else {
        newErrors.otp = ''; // Clear OTP error if already verified
      }
    }
    setErrors(newErrors);

    if (!hasErrors) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      // Set touched state to true for current step fields
      const newTouched = { ...touched };
      currentStepFields.forEach((field) => {
        newTouched[field] = true;
      });
      setTouched(newTouched);
    }

  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    // Check email validity
    if (name === 'email') {
      const isValid = validateEmail(value);
      setIsEmailValid(isValid);
    }

    if (touched[name]) {
      const error = validateField(name, value, true);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    const fieldsToValidate = ['name', 'email', 'phone', 'password', 'address'];

    let hasErrors = false;

    // Validate all fields
    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formValues[field], true);
      newErrors[field] = error;
      if (error) hasErrors = true;
    });

    setErrors(newErrors);

    if (hasErrors) return;

    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const response = await createUser(formValues);
        if (response.success) {
          toast.success(response.message);
          setTimeout(() => {
            setFormValues({
              name: '',
              email: '',
              phone: '',
              address: '',
              password: '',
              otp: ''
            });
            setActiveStep(0);
            navigate('/');
          }, 2000);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || 'Error submitting the form');
      } finally {
        setIsSubmitting(false);
      }
    }, 2000); 
  };

  const handleRequestOTP = async () => {

    setIsOtpSending(true);
    try {
      // Call API to request OTP
      const response = await requestOtp(formValues.email); // Assume you have this API function
      if (response.success) {
        setOtpRequested(true);  // Show OTP input after request
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Error requesting OTP');
    } finally {
      setIsOtpSending(false); // End OTP sending process
    }
  };

  const handleVerifyOTP = () => {
    setIsOtpVerifying(true);
  
    setTimeout(async () => {
      try {
        const response = await verifyOtp(formValues.email, formValues.otp);
        if (response.success && response.data.verified) {
          setEmailVerified(true);
          setOtpRequested(false);
          toast.success('Email verified successfully');
        } else {
          toast.error('OTP verification failed');
        }
      } catch (error) {
        toast.error(error.message || 'Error verifying OTP');
      } finally {
        setIsOtpVerifying(false); 
      }
    }, 3000);
  };
  

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ['name', 'email', 'otp'];
      case 1:
        return ['phone', 'address'];
      case 2:
        return ['password'];
      default:
        return [];
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={formValues.name}
              onFocus={() => handleFocus('name')}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={formValues.email}
              onFocus={() => handleFocus('email')}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={
                errors.email || 
                (isEmailValid && !otpRequested && !emailVerified
                  ? 'Please verify OTP before proceeding.' 
                  : '')
              }
              disabled={emailVerified} 
              InputProps={{
                endAdornment: isEmailValid && !otpRequested && !emailVerified && (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRequestOTP}
                      disabled={!isEmailValid || otpRequested} // Disable button if email is invalid or OTP is already requested
                      size="small"
                      sx={{ textTransform: 'none' }} // Optional: To prevent all caps in the button text
                    >
                      {isOtpSending ? 'Sending OTP...' : 'Get OTP'}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            {otpRequested && !emailVerified && (
              <Box>
                <TextField
                  label="OTP"
                  variant="outlined"
                  name="otp"
                  value={formValues.otp}
                  onFocus={() => handleFocus('otp')}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.otp}
                  helperText={errors.otp}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleVerifyOTP}
                          size="small"
                          sx={{ textTransform: 'none' }}
                        >
                          {isOtpVerifying ? 'Verifying OTP...' : 'Verify OTP'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              label="Phone"
              variant="outlined"
              name="phone"
              value={formValues.phone}
              onFocus={() => handleFocus('phone')}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              value={formValues.address}
              onFocus={() => handleFocus('address')}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.address}
              helperText={errors.address}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              value={formValues.password}
              onFocus={() => handleFocus('password')}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="form-container d-flex gap-4">
      <form className="login-form">
        <div className="form-text">
          <h2>Welcome to Meeting Plus</h2>
          <p className="heading-text">Enter your details to create an account</p>
        </div>
        <div style={{ maxWidth: 500, margin: 'auto', padding: '20px' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box>{getStepContent(activeStep)}</Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ mt: 1, width: '30%' }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{ mt: 1, width: '30%' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                // disabled={activeStep === 0 && !formValues.name && !formValues.email}
                sx={{ mt: 1, width: '30%' }}
              >
                Next
              </Button>
            )}
          </Box>
        </div>
        <div className="or or-2">Or continue with</div>
          <button type="button" className="google-signin-btn" onClick={googleRegister}>
            <img src={googleimg} alt="Logo" />SignUp with Google</button>
      </form>
      <div className="login-image">
        <img src={loginimage} alt="Login Illustration" />
      </div>
    </div>
  );
};

export default SignUp;

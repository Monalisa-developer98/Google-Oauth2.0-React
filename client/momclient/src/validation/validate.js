// validation function

export const validateField = (fieldName, value, isFocused) => {
    let error = '';
  
    switch (fieldName) {
      case 'name':
        if (!value.trim() && isFocused) {
          error = 'Name is required.';
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Invalid character.';
        } else if (value.length < 4) {
          error = 'Minimum 4 characters required';
        }
        break;
      case 'phone':
        if (!value.trim() && isFocused) {
          error = 'Phone number is required.';
        } else if (!/^[0-9]*$/.test(value)) {
          error = 'Invalid character';
        } else if (value.length !== 10) {
          error = 'Please enter a valid mobile number';
        }
        break;
      case 'email':
        if (!value.trim() && isFocused) {
          error = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'password':
        if (!value.trim() && isFocused) {
          error = 'Password is required.';
        } else if (value.length < 6) {
          error = 'Minimum 6 characters required';
        }
        break;
        case 'confirmPassword':
        if (!value.trim() && isFocused) {
          error = 'Confirm Password is required.';
        } else if (value.length < 6) {
          error = 'Minimum 6 characters required';
        }
        break;
      case 'address':
        if (!value.trim() && isFocused) {
          error = 'Address is required.';
        }
        break;
      case 'otp':
        if (!value.trim() && isFocused) {
          error = 'OTP is required.';
        } else if (value.length !== 6) {
          error = 'Please enter a 6-digit OTP';
        }
        break; 
      case 'empId':
        if (!value.trim() && isFocused) {
          error = 'Employee Id is required.';
        }
        break;
        case 'designation':
        if (!value.trim() && isFocused) {
          error = 'Designation is required.';
        }
        break; 
        case 'department':
        if (!value.trim() && isFocused) {
          error = 'Department is required.';
        }
        break; 
        case 'unit':
        if (!value.trim() && isFocused) {
          error = 'Unit is required.';
        }
        break;     
      default:
        break;
    }
  
    return error;
  };
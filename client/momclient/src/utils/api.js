// http://localhost:9090/api/send-otp

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090/api',
});
export const googleAuth = (code) => api.get(`/google?code=${code}`);
export const googleAuthRegister = (code) => api.post(`/google?code=${code}`);

// request otp to verify email
export const requestOtp = async (email) => {
  try {
    const response = await axios.post('http://localhost:9090/api/send-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Server error' };
  }
};

// verify email
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post('http://localhost:9090/api/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Server error' };
  }
};

//signup
export const createUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:9090/api/create-employee', userData);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};

// send otp to login
export const loginWithOtp = async (email) => {
  try {
    const response = await axios.post('http://localhost:9090/api/login-otp', { email });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};

// verify otp while login
export const verifyLoginOtp = async (email, otp) => {
  try {
    const response = await axios.post('http://localhost:9090/api/verify-login-otp', { email, otp });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};

// login with password
export const loginWithPassword = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:9090/api/user-login', { email, password });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};

// reset password
export const resetPassword = async (email, otp, password, nwpassword) => {
  try {
    const response = await axios.post('http://localhost:9090/api/reset-password', { email, otp, password, nwpassword });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating Password');
  }
};

//resend otp
export const resendOtp = async (email) => {
  try {
    const response = await axios.post('http://localhost:9090/api/login-otp', { email });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};

// admin add employee
export const addEmployee = async (userData) => {
  try {
    const response = await axios.post('http://localhost:9090/api/add-employee', userData);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating user');
  }
};

export const listEmployee = async ({ searchKey, page, limit }) => {
  try {
    const response = await axios.get('http://localhost:9090/api/employees', {
      params: { searchKey, page, limit }
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching employees');
  }
};


// activate employee
export const activateEmployee = async (id) => {
  try {
    const response = await axios.post(`http://localhost:9090/api/activate/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error activating employee');
  }
};

// Deactivate Employee
export const deactivateEmployee = async (id) => {
  try {
    const response = await axios.post(`http://localhost:9090/api/deactivate/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deactivating employee');
  }
};
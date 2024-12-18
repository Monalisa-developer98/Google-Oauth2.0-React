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
// export const createUser = async (userData) => {
//   try {
//     const response = await axios.post('http://localhost:9090/api/create-employee', userData);
//     return response.data; 
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Error creating user');
//   }
// };

export const createUser = async (userData, profile) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    // Append profile picture to the FormData
    if (profile) {
      formData.append('profile', profile);
    }

    const response = await axios.post('http://localhost:9090/api/create-employee', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

// fetch employee details by id
export const fetchEmployeeById = async(id) => {
  try{
    const token = localStorage.getItem('auth-token');
    if (!token){
      throw new Error('No auth Token Found');
    }

    const response = await axios.get(`http://localhost:9090/api/viewEmployee/${id}`,{
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching employee details', err);
    throw err;
  }
}


// update employee details
export const updateProfile = async (empId, updatedData, profile) => {
  try {
    const formData = new FormData();

    Object.keys(updatedData).forEach((key) => {
      formData.append(key, updatedData[key]);
    });

    if (profile) {
      formData.append('profile', profile);
    }

    const response = await axios.post(`http://localhost:9090/api/update-profile/${empId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating profile');
  }
};

// import employees by csv file
export const importFromCsv = async(file) => {
  const apiurl = 'http://localhost:9090/api/upload-csv';
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    }
  }
  try {
    const response = await axios.post(apiurl, formData, config);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error uploading file');
  }
}


import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { AppBar, Toolbar, Typography, IconButton, Modal, Box, TextField, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import { Form } from "react-bootstrap";
import { fetchEmployeeById, updateProfile } from '../../utils/api';

const Navbar = () => {

  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [accountDeactivated, setAccountDeactivated] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    logout(); 
    navigate('/');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('token');
  };

  // Fetch employee details by ID
  useEffect(() => {
    console.log('useEffect triggered for user:', user);
    const getEmployeeDetails = async () => {
      try {
        if (user && user.id) {
          console.log('Fetching employee details for ID:', user.id); 
          const data = await fetchEmployeeById(user.id);
          console.log('Fetched employee data:', data); // Log the data returned from API
          // console.log('Single employee data:', data.data);
          if (data?.error || data?.success === false) {
            toast.error('Your account has been deactivated. Please contact your administrator.');
            setAccountDeactivated(true);
            setTimeout(() => {
              localStorage.removeItem('auth-token');
              navigate('/'); 
            }, 4000);
          } else {
            setEmployeeDetails(data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching employee details:', err);
        toast.error('Something went wrong. Please try again.');
      }
    };

    if (user && !accountDeactivated) {
      const intervalId = setInterval(() => {
        getEmployeeDetails();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [user, navigate, accountDeactivated]);


// profile image
const BASE_URL = "http://localhost:9090"; 

function getEmployeeImage(picture) {
  if (!picture) {
    return null;
  }
  if (picture.startsWith("http") || picture.startsWith("https")) {
    return picture;
  } else {
    return `${BASE_URL}/${picture}`;
  }
}
const employeeImage = getEmployeeImage(employeeDetails.profilePicture);


// profile update
const handleProfileUpdate = async (event) => {
  event.preventDefault();

  const updatedData = {
    name: employeeDetails.name,
    phone: employeeDetails.phone,
    address: employeeDetails.address,
  };

  const profileFile = document.querySelector('input[name="profile"]').files[0];
  try {
    const response = await updateProfile(user.id, updatedData, profileFile);
    
    if (response.success) {
      toast.success(response.message);
      setEmployeeDetails((prevDetails) => ({
        ...prevDetails,
        ...response.data,
      }));
      handleClose();
    } else {
      toast.error(response.message);
    }
    } catch (error) {
    toast.error('Error updating profile');
    console.error('Error updating profile:', error.message);
  }
};

 
  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Welcome to Dashboard Panel
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            {employeeImage ? (
              <img src={employeeImage} alt="Profile" className="profile-pic" />
            ) : (
              <AccountCircleIcon />
            )}
            <span className="username">{accountDeactivated ? 'Account Deactivated' : employeeDetails.name || 'Guest'}</span>
          </IconButton>
          <IconButton color="inherit" onClick={handleOpen}>
            <SettingsIcon />
          </IconButton>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </Toolbar>
      </AppBar>

      {/* Modal for updating profile */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Update Profile
          </Typography>
          <form onSubmit={handleProfileUpdate}>
            <TextField
              label="Name"
              name="name"
              value={employeeDetails.name}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={employeeDetails.phone}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, phone: e.target.value })}
              fullWidth
              margin="normal"
            />
             <div className="form-group profile-image">
             {employeeImage ? (
              <img src={employeeImage} alt="Profile" className="profile-pic" />
            ) : (
              <AccountCircleIcon />
            )}
          </div>
             <Form.Group controlId="formFile" className="mt-1">
      <Form.Label>Profile Photo</Form.Label>
      <Form.Control 
        type="file" 
        className="formControl"
        name="profile"
        accept=".jpg,.jpeg,.png,.pdf"
      />
    </Form.Group>
            <TextField
              label="Address"
              name="address"
              value={employeeDetails.address}
              onChange={(e) => setEmployeeDetails({ ...employeeDetails, address: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Box sx={{ textAlign: 'right', marginTop: 3 }}>
              <Button onClick={handleClose} sx={{ marginRight: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
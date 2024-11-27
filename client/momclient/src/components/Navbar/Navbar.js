import React from 'react';
import './Navbar.css';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear the user context
    navigate('/'); // Redirect to login page
    localStorage.removeItem('auth-token');
    localStorage.removeItem('token');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Welcome to Dashboard Panel
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
        {user.picture ? (
            <img src={user.picture} alt="Profile" className="profile-pic" />
          ) : (
            <AccountCircleIcon />
          )}
          <span className="username">{user.username || 'Guest'}</span>
        </IconButton>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
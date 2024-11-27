import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <h3>Welcome To User Dashboard</h3>
      </Box>
    </>
  )
}

export default UserDashboard

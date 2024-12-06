import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginOtp from './components/LoginOtp/LoginOtp';
import SignUp from "./components/SignUp/SignUp";
import OtpForm from './components/Otp-Form/OtpForm';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import LoginEmail from './components/LoginEmail/LoginEmail';
import UserDashboard from './components/UserDashboard/UserDashboard';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="4594154553-6q8mt8m8vv0b56ic8eroe3f8rqk8cec8.apps.googleusercontent.com">
        <LoginOtp />
      </GoogleOAuthProvider>
    )
  }

  const GoogleSignWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="4594154553-6q8mt8m8vv0b56ic8eroe3f8rqk8cec8.apps.googleusercontent.com">
        <SignUp />
      </GoogleOAuthProvider>
    )
  }

  return (
    <AuthProvider>
      <Router>
    <div className='container d-flex justify-content-center align-items-center form-container'>
    <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
      />
      <Routes>
        <Route path="/" element={<GoogleAuthWrapper />} />
        <Route path="/signup" element={<GoogleSignWrapper />} />
        <Route path="/verify-otp" element={<OtpForm />} />

        <Route path="/admin-dashboard" 
        element={ <ProtectedRoute> <AdminDashboard /> </ProtectedRoute>}
        />
        <Route path="/user-dashboard" 
        element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} 
        />
        <Route path="/user-login" element={<LoginEmail />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        {/* <Route path="*" element={<PagenotFound />} />   error page */}
      </Routes>
    </div>
  </Router>
</AuthProvider>
    
  )
}

export default App;
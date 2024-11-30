const authService = require("../services/authService");
const Responses = require("../helpers/response");
const messages = require("../constants/constMessages");

// send otp
const sendOtpToEmployee = async (req, res) => {
  try {
      const { email, name } = req.body; 
      const result = await authService.sendOtp(email, name);
      if (result.maxOtpReached) {
          return Responses.failResponse(req, res, null, messages.maxOtpReached, 429);
      }
      if (result.alreadyVerified) {
          return Responses.failResponse(req, res, null, messages.alreadyVerified, 400);
      }
      return Responses.successResponse(req, res, result, messages.otpSent, 201);
  } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error);
  }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body; 
        const result = await authService.verifyOTP(email, otp);
        
        if (result.OtpExpired) {
            return Responses.failResponse(req, res, null, messages.otpExpired, 400);
        }

        if (result?.invalidOtp) {
            return Responses.failResponse(req, res, null, messages.invalidOtp, 400);
        }
        if (result.alreadyVerified) {
            return Responses.failResponse(req, res, null, messages.alreadyVerified, 400);
        }
        return Responses.successResponse(req, res, result, messages.otpVerifiedSuccess, 200);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
};

// login with otp
const loginWithOtp = async (req, res) => {
    try {
        const { email } = req.body; 
        const result = await authService.loginWithOtp({ email });
        if (result.isInValidUser) {
            return Responses.failResponse(req, res, null, messages.userNotFound, 404);
        }
        if (result.maxOtpReached) {
            return Responses.failResponse(req, res, null, messages.maxOtpReached, 429);
        }
        return Responses.successResponse(req, res, result, messages.otpSent, 200);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
}

// verify user otp
const verifyUserOTP = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { email, otp } = req.body; 
        const result = await authService.verifyUserOTP(email, otp);
        
        if (result.OtpExpired) {
            return Responses.failResponse(req, res, null, messages.otpExpired, 400);
        }

        if (result?.invalidOtp) {
            return Responses.failResponse(req, res, null, messages.invalidOtp, 400);
        }
        if (result.maxOtpReached) {
            return Responses.failResponse(req, res, null, messages.maxverifyReached, 429);
        }
        return Responses.successResponse(req, res, result, messages.otpVerifiedSuccess, 200);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
};

// signIn By Password
const signInByPassword = async (req, res) => {
    try {
        const { email, password } = req.body; 
      const result = await authService.signInByPassword(email, password);
      if (!result) {
        return Responses.failResponse(req, res, null, messages.userNotFound, 200);
      }
      if (result?.incorrectPassword) {
        return Responses.failResponse(req, res, null, messages.incorrectPassword, 401);
      }
      if (result.noPasswordSet) {
        return Responses.failResponse(req, res, null, messages.noPasswordSet , 400);
    }
  
      if (result?.isUserDeactivated) {
        return Responses.failResponse(req, res, null, messages.invalidUser, 200);
      }
  
      return Responses.successResponse(req, res, result, messages.signInSuccess, 200);
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error);
    }
};

// reset password
const resetPassword = async (req, res) => {
    try {
      const { email, password, otp, nwpassword } = req.body;
      const result = await authService.resetPassword(email, otp, password, nwpassword);
      if (!result) {
        return Responses.failResponse(req, res, null, messages.userNotFound, 200);
      }
      if (result?.invalidOtp) {
        return Responses.failResponse(req, res, null, messages.invalidOtp, 200);
      }
      if (result?.passwordMismatch) {
        return Responses.failResponse(req, res, null, messages.passwordMismatch, 200);
      }
      return Responses.successResponse(req, res, result, messages.passResetSuccess, 200);
    } catch (error) {
        return Responses.errorResponse(req, res, error);
    }
};

const logoutController = async (req, res) => {
    try {
   
        const result = await authService.logoutService(req);
        if (!result) {
            return Responses.failResponse(req, res, null,messages.internalError, 400);
        }
        if (result.error) {
            return Responses.failResponse(req, res, null, result.error, 400);
        }
    
        return Responses.successResponse(req, res, result, messages.logoutSuccess , 200);
    } catch (error) {
        console.error('Error in logout controller:', error);
        if (!res.headersSent) {
            return Responses.errorResponse(req, res, error.message , 500);
        }
    }
};

/// Login with google
const loginWithGoogle = async (req, res) => {
    try{
        const {code}= req.query; 
        if (!code) {
            return Responses.failResponse(req, res, null, messages.googleAuthFailed, 400);
          }
        const result = await authService.loginWithGoogle(code);
        if (!result) {
            return Responses.failResponse(req, res, null, messages.userNotFound, 200);
        }
        return Responses.successResponse(req, res, result, messages.signInSuccess, 200); 
    } catch (error) {
        return Responses.errorResponse(req, res, error.message, 500);
    }
}

/// signup with google
const SignUpWithGoogle = async (req, res) => {
    try{
        const {code}= req.query; 
        if (!code) {
            return Responses.failResponse(req, res, null, messages.googleAuthFailed, 400);
        }
        const result = await authService.SignUpWithGoogle(code);
        if (result?.isDuplicateEmail) {
            return Responses.failResponse(req, res, null, messages.duplicateEmail, 200);
        }      
        return Responses.successResponse(req, res, result, messages.createdSuccess, 201); 
    } catch (error) {
        return Responses.errorResponse(req, res, error.message, 500);
    }
}


module.exports = {
    sendOtpToEmployee,
    verifyOtp,
    loginWithOtp,
    verifyUserOTP,
    signInByPassword,
    resetPassword,
    logoutController,
    loginWithGoogle,
    SignUpWithGoogle
}
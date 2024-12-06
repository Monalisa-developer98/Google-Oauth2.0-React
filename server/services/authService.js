const Employee = require("../models/employeeModel");
const emailService = require("./emailService");
const ObjectId = require("mongoose").Types.ObjectId;
const OTP = require('../models/otpModel');
const authMiddleware = require("../middlewares/authMiddleware");
const { verifyPassword, generateHashPassword } = require('../helpers/commonHelper')

const {oauth2client} = require("../utils/googleConfig");
const axios = require('axios');

const OTP_EXPIRATION_TIME = 10 * 60 * 1000; 
const OTP_COOLDOWN_PERIOD = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

const generateOTP = () => {
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

/**FUNC- TO VERIFY VALID EMAIL USER */
const verifyEmail = async (email) => {
    return await Employee.findOne({ email, isVerified: true, isActive: true }, 
        { _id: 1, email: 1, name: 1, otpAttempts: 1});
};

// REQUEST OTP in signup
const sendOtp = async (email) => {
    const now = Date.now();
    let otpRecord = await OTP.findOne({ email });
    const newOtp = generateOTP();
    const currentTime = Date.now();

    if (otpRecord) {
        const isExpired = now - otpRecord.createdAt > OTP_EXPIRATION_TIME;

        if (isExpired) {
            otpRecord.otp = newOtp;
            otpRecord.createdAt = now;
            otpRecord.attempts = 1; 
        } else if (otpRecord.isVerified) {
            if (currentTime - otpRecord.verifiedAt < OTP_COOLDOWN_PERIOD) {
                return { alreadyVerified: true };
            }
        }
        else if (otpRecord.attempts >= MAX_REQUESTS) {
            return { maxOtpReached: true };
        } 
        else {
            otpRecord.otp = newOtp;
            otpRecord.attempts += 1;
        }
    } else {
        otpRecord = new OTP({
            email,
            otp: newOtp,
            attempts: 1,
            createdAt: now
        });
    }
    await otpRecord.save();

    const emailSubject = 'OTP to Verify Your Email to Schedule a Demo with MinutesVault';
    const mailData = `<p>Thank you for your interest. Your OTP is <strong>${otpRecord.otp}</strong>. It will expire in 10 minutes.</p> `;
    await emailService.sendMail(email, emailSubject, mailData);

    return { otp: otpRecord.otp, attempts: otpRecord.attempts, otpSent: true };
};

// verify otp in signup
const verifyOTP = async (email, otp) => {
    try {
        const otpRecord = await OTP.findOne({ email });
        const currentTime = Date.now();

        if (currentTime - otpRecord.createdAt > OTP_EXPIRATION_TIME) {
            // await OTP.deleteOne({ email }); 
            return { OtpExpired: true };
        }
        if (otpRecord.isVerified) {
            if (currentTime - otpRecord.verifiedAt < OTP_COOLDOWN_PERIOD) {
                return { alreadyVerified: true };
            }
        }

        if (otpRecord.otp !== otp) {
            // otpRecord.attempts += 1;
            await otpRecord.save();
            return { invalidOtp: true, attemptsRemaining: MAX_REQUESTS - otpRecord.attempts };
        }
        otpRecord.isVerified = true;
        otpRecord.verifiedAt = currentTime;
        await otpRecord.save();
        return { verified: true };

    } catch (error) {
        console.error("Error in OTP verification:", error);
        return { error: error.message };
    }
};


// SIGN IN BY OTP 
const loginWithOtp = async (data) => {
    const employee = await verifyEmail(data.email);
    if (!employee) {
        return { isInValidUser: true };
    }
    if (employee.otpAttempts >= MAX_REQUESTS) {
        return { maxOtpReached: true };
    } 

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    employee.otp = otp;
    employee.otpExpiry = otpExpiry;
    await employee.save();

    const emailSubject = 'OTP to Verify Your Email to Schedule a Demo with MinutesVault';
    const mailData = `<p>Thank you for your interest. Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p> `;
    await emailService.sendMail(employee.email, emailSubject, mailData);
      
    return { otpSent: true };
};

// verify-otp in sign-in
const verifyUserOTP = async (email, otp) => {
    try {
        const otpRecord = await Employee.findOne({ email });
        if (!otpRecord) {
            return { error: "No OTP record found for this email" };
        }
        const currentTime = Date.now();

       if (currentTime > new Date(otpRecord.otpExpiry).getTime()) {
            return { OtpExpired: true };
        }

        if (otpRecord.otp !== otp) {
            otpRecord.otpAttempts = otpRecord.otpAttempts ? otpRecord.otpAttempts + 1 : 1;
            await otpRecord.save();

            if (otpRecord.otpAttempts >= MAX_REQUESTS) {
                return { maxOtpReached: true };
            }
            return { invalidOtp: true, attemptsRemaining: MAX_REQUESTS - otpRecord.otpAttempts };
        }

        // Reset OTP attempts after successful verification
        otpRecord.otpAttempts = 0;
        otpRecord.otp = null;
        otpRecord.otpExpiry = null;
        await otpRecord.save();

        const token = await authMiddleware.generateUserToken({ userId: otpRecord._id});
        return { verified: true, token, otpRecord };

    } catch (error) {
        console.error("Error in OTP verification:", error);
        return { error: error.message };
    }
};

// sign in with password
const signInByPassword = async (email, password) => {
    const userData = await Employee.findOne({ email });
    if (!userData) {
      return false;
    }
    if (!userData.isActive) {
      return {
        isUserDeactivated: true,
      };
    }
    if (!userData.password) {
        return {
            noPasswordSet: true,
        };
    }
    const passwordIsValid = await verifyPassword(password, userData.password);

    if (!passwordIsValid) {
      return {
        incorrectPassword: true,
      };
    }
    const token = await authMiddleware.generateUserToken({userId: userData._id});
    return { token, userData};
};

// reset password
const resetPassword = async (email, otp, password, nwpassword) => {
    const user = await Employee.findOne({ email });
    if (!user) {
        return false;
    }
    const otpRecord = await Employee.findOne({ email, otp });
    if (!otpRecord || (otpRecord.otp !== otp)) {
        return { invalidOtp: true };
    }
  
    if (password !== nwpassword) {
        return { passwordMismatch: true };
    }
    const hashedPassword = await generateHashPassword(nwpassword);
  
    user.password = hashedPassword;
    await user.save();
    return user;
};

// logout
const logoutService = (req) => {
    return new Promise((resolve, reject) => {
        try {
            // Check if the session exists
            if (!req.session) {
                console.log('Session does not exist.');
                return resolve({ error: 'Session not found.' });  
            }

            // If a token exists, nullify it
            if (req.session.token) {
                req.session.token = null;
                console.log('Token removed from session.');
            }

            // Destroy the session to log the user out
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return resolve({ error: 'Failed to logout. Session destruction error.' });  
                }

           
                resolve({ message: 'Logout successful. Session cleared.' });  
            });
        } catch (error) {
            console.error('Error during logout operation:', error);
            reject({ error: 'Internal server error during logout.' });  
        }
    });
};

// Login With Google
const loginWithGoogle = async (code) => {
    try{
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )

        // console.log('Google user info:', userRes.data);
        const {email} = userRes.data;  // Extract email from Google response
        let user = await Employee.findOne({email, isActive: true});
        if (!user) {
            return false;
        }
        const token = await authMiddleware.generateUserToken({userId: user._id, name: user.name});
        return { token, user};
    } catch (err) {
        console.error('Error in loginWithGoogle:', err.message);
        throw new Error('Failed to sign in with Google');
    }
}

// SignUp With Google
const SignUpWithGoogle = async (code) => {
    try{
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )

        // console.log('Google user info:', userRes.data);
        const {email} = userRes.data;  // Extract email from Google response
        let user = await Employee.findOne({email, isActive: true}); 
        if (user){
            return { isDuplicateEmail: true };
        }
        // console.log(user)
        if (!user) {
            user = new Employee({
                googleId: userRes.data.id, // Use Google ID as a unique identifier
                email: email,
                name: userRes.data.name,
                profilePicture: userRes.data.picture,
                isActive: true,
                isVerified: userRes.data.verified_email,
                role: 'user',
            });
            await user.save();
            return user;
        }
        return false;
    } catch (err) {
        console.error('Error in SignWithGoogle:', err.message);
        throw new Error('Failed to sign up with Google');
    }
}



module.exports = {
    sendOtp,
    loginWithOtp,
    verifyOTP,
    verifyUserOTP,
    signInByPassword,
    resetPassword,
    logoutService,
    loginWithGoogle,
    SignUpWithGoogle
}
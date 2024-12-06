const userNotFound = 'User not Found. Please SignUp to Login'
const otpSentFail = async(email) => {
    return `Failed to send OTP to ${email}.`
}
const otpSentSuccess = async (email) => {
    return `We have sent an OTP to your registered email address at ${email}. Please check your email and enter it here.`;
};
const duplicateEmail = 'Email already exists.';
const createdSuccess =  'Register Successfully '
const alreadyVerified = 'This email is already verified. Please try again after 10 minutes.'
const maxOtpReached = 'Maximum OTP requests reached. Please wait for 10 minutes until the OTP expires.'
const otpSent = 'OTP has been sent to your email'
const invalidOtp = 'Wrong OTP. Please try again.';
const otpVerifiedSuccess = 'Your OTP has been verified successfully';
const otpExpired = 'OTP has expired.'
const emailNotVerified = 'Your Email is not verified. Please verify your Email.'
const creationFailed = 'Creation Failed'
const maxverifyReached = 'Maximum verification requests reached. Please try after 10 minutes'
const incorrectPassword = 'Incorrect Password'
const invalidUser = 'User is not valid! Your account has been deactivated.'
const signInSuccess = 'Login successful!'
const passwordMismatch = 'Password and Confirm Password does not match'
const passResetSuccess = 'Password updated successfully'
const employeeCreated = 'Employee added successfully'
const recordsNotFound = 'No records found'
const recordsFound = 'Records found'
const activateSuccess = 'Acivated Successfully'
const deactivateSuccess = 'Deactivated Successfully'
const googleAuthFailed = 'Authorization code is missing'
const noPasswordSet = 'Your Password is empty. Please set a password.'
const noDataProvided = 'No data provided'
const updateProfile = 'Profile updated successfully'

module.exports = {
    userNotFound,
    otpSentFail,
    otpSentSuccess,
    duplicateEmail,
    createdSuccess,
    alreadyVerified,
    maxOtpReached,
    otpSent,
    invalidOtp,
    otpVerifiedSuccess,
    otpExpired,
    emailNotVerified,
    creationFailed,
    maxverifyReached,
    incorrectPassword,
    invalidUser,
    signInSuccess,
    passwordMismatch,
    passResetSuccess,
    employeeCreated,
    recordsNotFound,
    recordsFound,
    activateSuccess,
    deactivateSuccess,
    googleAuthFailed,
    noPasswordSet,
    noDataProvided,
    updateProfile
}
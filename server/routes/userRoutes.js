const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const validator = require('../validators/employeeValidator');
const Middleware = require('../middlewares/authMiddleware');

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
  
const upload = multer({ storage: storage })

//signup flow
router.post('/send-otp', authController.sendOtpToEmployee);
router.post('/verify-otp', authController.verifyOtp);
router.post('/create-employee', upload.single('profile'), employeeController.createEmployee);

//login with otp
router.post('/login-otp', validator.loginWithOtpController, authController.loginWithOtp);
router.post('/verify-login-otp', validator.verifyUserOTP, authController.verifyUserOTP);

// signin by password -- http://localhost:9090/api/user-login
router.post('/user-login', validator.signInByPasswordValidator, authController.signInByPassword);
router.post('/reset-password', validator.resetPasswordValidator, authController.resetPassword);

//logout
router.post('/logout', Middleware.verifyUserToken, authController.logoutController);

// admin add employee
router.post('/add-employee', employeeController.addEmployee);
router.get('/employees', employeeController.listEmployee);

// activate employee
router.post('/activate/:empId', employeeController.activateEmployee);

// dectivate employee
router.post('/deactivate/:empId', employeeController.deactivateEmployee);

//login with google
router.get('/google', authController.loginWithGoogle);

//signup with google
router.post('/google', authController.SignUpWithGoogle);

module.exports = router;
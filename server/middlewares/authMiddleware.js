const jwt = require("jsonwebtoken");
const Responses = require("../helpers/response");
const messages = require("../constants/constMessages");
const employeeService = require("../services/employeeService");

// generate new token
const generateUserToken = async (data) => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data must be a plain object');
    }
  
    const token = jwt.sign(data, process.env.JWT_USER_SECRET, {
      expiresIn: '1d',
    });
    return `Bearer ${token}`;
};

// verify token for user
const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("token-->", token);
    if (token.startsWith("Bearer ")) {
      token = token.substring(7, token.length);
    }
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    console.log('Decoded-----',decoded);
    const userId = decoded.userId;
    const isActiveUser = await employeeService.verifyEmployee(userId);
    console.log("isActiveUser------", isActiveUser);
    if (isActiveUser) {
      req.userId = userId;
      req.userData = isActiveUser;
      // console.log("UserDetails------", isActiveUser);
      next();
    } else {
      return Responses.failResponse(
        req,
        res,
        { isInValidUser: true },
        messages.invalidUser,
        200
      );
    }
  } catch (error) {
    console.log("Errorrr", error);
    return Responses.failResponse(req, res, null, messages.invalidToken, 200);
  }
};


const verifyUserToken = async (req, res, next) => {
  // Retrieve the token from the authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  // If no token is provided, respond with an error
  if (!token) {
      const errorMessage = 'Token is required for authentication';
      console.log(`Token missing for request to ${req.method} ${req.url}: ${errorMessage}`);
      return Responses.failResponse(req, res, null, errorMessage, 401);
  }

  // Verify the token
  try {
      const verified = jwt.verify(token, process.env.JWT_USER_SECRET); // Verify token using JWT secret
      req.user = verified; // Attach the decoded user information to the request object
      next(); // Pass control to the next middleware/controller
  } catch (error) {
      // Enhanced error logging
      console.error(`Token verification failed for request to ${req.method} ${req.url}:`, error);

      // Handle specific error cases
      if (error.name === 'TokenExpiredError') {
          return Responses.failResponse(req, res, null, 'Token has expired', 401); // Handle expired token case
      }

      // Generic error handling for invalid or malformed token
      return Responses.failResponse(req, res, null, 'Invalid or expired token', 403);
  }

}

module.exports = {
  generateUserToken,
  verifyUserToken,
  verifyToken
};
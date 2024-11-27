const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_API_URL || 'http://localhost:9090'}/api/auth/google/callback`, // Use BACKEND_API_URL,
    scope: ["profile", "email"],
  },
  function(accessToken, refreshToken, profile, cb) {
      cb(null, profile);
  }
));

// Serialize and deserialize user for session
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
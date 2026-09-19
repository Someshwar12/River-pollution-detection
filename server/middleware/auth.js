// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // MOCK USER for local development to proceed with upload logic
    // This allows the server to run without a frontend login system yet.
    req.user = { id: 'mockUserId', role: 'user' };
    return next(); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here');

    // This part would normally fetch the user from the DB, but we keep it mocked for stability
    req.user = { id: decoded.id, role: 'user' }; // Mock the user object based on JWT payload

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    // Fallback to mock user on failure
    req.user = { id: 'mockUserId', role: 'user' };
    next();
  }
};

// Note: Other middleware like isAdmin, etc., would also be exported here.
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;
  
  console.log('Auth Middleware - Headers:', req.headers);

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (remove 'Bearer ')
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth Middleware - Token received:', token ? token.substring(0, 10) + '...' : 'none');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware - Token verified for user:', decoded.id);

      // Attach user ID to request
      req.user = { id: decoded.id };

      next(); // Proceed to the protected route
    } catch (error) {
      console.error('Auth Middleware - Token verification failed:', error.message);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } else {
    console.log('Auth Middleware - No Authorization header or wrong format');
  }

  if (!token) {
    console.log('Auth Middleware - No token found');
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

module.exports = { protect }; 
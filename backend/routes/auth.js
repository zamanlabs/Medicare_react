// routes/auth.js
const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
];

// Validation rules for login
const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerValidation, registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, loginUser);

// @route   GET api/auth/me
// @desc    Get logged in user data
// @access  Private
router.get('/me', protect, getMe);

module.exports = router; 
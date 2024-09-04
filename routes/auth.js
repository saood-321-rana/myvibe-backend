const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, deleteUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/users', auth, getAllUsers);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/users/:id', auth, deleteUser);

module.exports = router;

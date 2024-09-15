const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, deleteUser, updateUserProfile, getUserProfile } = require('../controllers/authController');
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

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put('/users/me', auth, updateUserProfile);

// @route   GET api/users/me
// @desc    Get the profile of the currently logged-in user
// @access  Private
router.get('/users/profile', auth, getUserProfile);


module.exports = router;

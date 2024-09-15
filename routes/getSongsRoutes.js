const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getSongsByPlaylist, 
  getAllSongsForUser, 
  getAllSongsByUserNoAuth, 
  addToQueue,
  getQueueSongsForUser 
} = require('../controllers/getSongsController');

// @route   GET /api/playlist-songs/:playlistId
// @desc    Get all songs in a playlist for the logged-in user
// @access  Private
router.get('/playlist-songs/:playlistId', auth, getSongsByPlaylist);

// @route   GET /api/user-songs
// @desc    Get all songs of the logged-in user
// @access  Private
router.get('/user-songs', auth, getAllSongsForUser);

// @route   GET /api/public-user-songs
// @desc    Get all songs of a user without authentication
// @access  Public
router.get('/public-user-songs', getAllSongsByUserNoAuth);

// @route   POST /api/add-to-queue
// @desc    Add a song to the queue for the logged-in user
// @access  Private
router.post('/add-to-queue', addToQueue);

// @route   GET /api/queue-songs
// @desc    Get all songs in the queue for the logged-in user
// @access  Private
router.get('/queue-songs', auth, getQueueSongsForUser);


module.exports = router;

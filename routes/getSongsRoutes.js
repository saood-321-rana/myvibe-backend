const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSongsByPlaylist, getAllSongsForUser } = require('../controllers/getSongsController'); 

// @route   GET /api/playlist-songs/:playlistId
// @desc    Get all songs in a playlist for the logged-in user
// @access  Private
router.get('/playlist-songs/:playlistId', auth, getSongsByPlaylist);

// @route   GET /api/user-songs
// @desc    Get all songs of the logged-in user
// @access  Private
router.get('/user-songs', auth, getAllSongsForUser);

module.exports = router;

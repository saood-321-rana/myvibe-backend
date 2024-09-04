const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addSongToPlaylist } = require('../controllers/playlistSongController'); // Ensure this import is correct

// @route   POST /api/playlist-songs
// @desc    Add a song to a playlist
// @access  Private
router.post('/', auth, addSongToPlaylist); // Ensure `addSongToPlaylist` is defined and imported correctly

module.exports = router;

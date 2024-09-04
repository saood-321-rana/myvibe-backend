const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSongsByPlaylist } = require('../controllers/getSongsController'); 

// @route   GET /api/playlist-songs/:playlistId
// @desc    Get all songs in a playlist for the logged-in user
// @access  Private
router.get('/:playlistId', auth, getSongsByPlaylist); 

module.exports = router;

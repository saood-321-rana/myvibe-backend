const express = require('express');
const router = express.Router();
const { addPlaylist, getPlaylists } = require('../controllers/playlistController');
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist'); // Import Playlist model

// @route   POST /api/playlists
// @desc    Create a new playlist
// @access  Private
router.post('/', auth, addPlaylist);

// @route   GET /api/playlists
// @desc    Get all playlists for the logged-in user
// @access  Private
router.get('/', auth, getPlaylists);

// @route   GET /api/playlists/user
// @desc    Get all playlists for the logged-in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id });
    res.json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const mongoose = require('mongoose');
const PlaylistSong = require('../models/PlaylistSong'); // Adjust path as necessary
const Playlist = require('../models/Playlist'); // Adjust path as necessary
const Song = require('../models/Song'); // Adjust path as necessary
const Music = require('../models/Music'); // Add the Music model

// Add Song to Playlist
const addSongToPlaylist = async (req, res) => {
  const { songId, playlistId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ msg: 'Invalid song or playlist ID.' });
    }

    const existingPlaylistSong = await PlaylistSong.findOne({ song: songId, playlist: playlistId });
    if (existingPlaylistSong) {
      return res.status(400).json({ msg: 'Song is already in the playlist.' });
    }

    const playlistSong = new PlaylistSong({
      song: songId,
      playlist: playlistId,
      userId: req.user.id
    });

    await playlistSong.save();

    // Update Music document to include the playlistId
    await Music.findByIdAndUpdate(
      songId,
      { $addToSet: { playlistIds: playlistId } }, // Use $addToSet to avoid duplicates
      { new: true, runValidators: true }
    );

    res.json({ msg: 'Song added to playlist successfully!' });
  } catch (error) {
    console.error('Error adding song to playlist:', error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { addSongToPlaylist };

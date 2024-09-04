const mongoose = require('mongoose');
const PlaylistSong = require('../models/PlaylistSong'); // Adjust path as necessary
const Music = require('../models/Music'); // Adjust path as necessary

// Fetch songs for a specific playlist
const getSongsByPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const currentUserId = req.user._id; // Assuming req.user contains the logged-in user info

    console.log('Fetching songs for playlistId:', playlistId);

    // Validate playlistId
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ msg: 'Invalid playlist ID.' });
    }

    // Find all PlaylistSong entries for the given playlist
    const playlistSongs = await PlaylistSong.find({ 
      playlist: playlistId
    });

    console.log('PlaylistSongs found:', playlistSongs);

    if (!playlistSongs.length) {
      return res.status(404).json({ msg: 'No songs found for this playlist.' });
    }

    // Extract song IDs
    const songIds = playlistSongs.map(playlistSong => playlistSong.song);

    // Find songs in Music collection based on extracted song IDs
    const songs = await Music.find({ 
      _id: { $in: songIds }
    });

    if (!songs.length) {
      return res.status(404).json({ msg: 'No songs found for this playlist.' });
    }

    // Update the `userIds` array in each song document
    await Promise.all(songs.map(async (song) => {
      if (!song.userIds.includes(currentUserId)) {
        song.userIds.push(currentUserId);
        await song.save();
      }
    }));

    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs for playlist:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { getSongsByPlaylist };

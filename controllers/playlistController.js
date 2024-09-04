const Playlist = require('../models/Playlist');

const addPlaylist = async (req, res) => {
  const { playlistName } = req.body;

  try {
    if (!playlistName) {
      return res.status(400).json({ msg: 'Playlist name is required.' });
    }

    // Create a new playlist with userId from the request
    const newPlaylist = new Playlist({
      userId: req.user.id, // Ensure req.user.id contains the authenticated user's ID
      playlistName
    });

    await newPlaylist.save();

    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error adding playlist:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id });
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { addPlaylist, getPlaylists };

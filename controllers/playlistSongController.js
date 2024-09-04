const mongoose = require('mongoose');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const PlaylistSong = require('../models/PlaylistSong');

const addSongToPlaylist = async (req, res) => {
  const { songId, playlistId } = req.body;

  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ msg: 'Invalid song or playlist ID.' });
    }

     // Check if playlist exists
    //  const playlist = await Playlist.findById(playlistId);
    //  if (!playlist) {
    //    console.error(`Playlist not found: ${playlistId}`);
    //    return res.status(404).json({ msg: 'Playlist not found.' });
    //  }

    // Check if song exists
    // const song = await Song.findById(songId);
    // if (!song) {
    //   console.error(`Song not found: ${songId}`);
    //   return res.status(404).json({ msg: 'Song not found.' });
    // }

   

    // Check if the song is already in the playlist
    const existingPlaylistSong = await PlaylistSong.findOne({ song: songId, playlist: playlistId });
    if (existingPlaylistSong) {
      return res.status(400).json({ msg: 'Song is already exist in the playlist.' });
    }

    // Add song to playlist
    const playlistSong = new PlaylistSong({
      song: songId,
      playlist: playlistId,
      userId: req.user.id
    });

    await playlistSong.save();

    res.json({ msg: 'Song added to playlist successfully!' });
  } catch (error) {
    console.error('Error adding song to playlist:', error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { addSongToPlaylist };

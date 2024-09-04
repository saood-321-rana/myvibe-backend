const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  songName: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  song: {
    type: String, // Store the file path or file URL
    required: true,
  },
  playlistIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }], // Array of playlist IDs
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
});

module.exports = mongoose.model('Music', MusicSchema);

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
});

module.exports = mongoose.model('Music', MusicSchema);

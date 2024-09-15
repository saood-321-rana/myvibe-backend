const mongoose = require('mongoose');
const PlaylistSong = require('../models/PlaylistSong'); // Adjust path as necessary
const Music = require('../models/Music'); // Adjust path as necessary
const Queue = require('../models/Queue'); // Adjust path as necessary

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

// Fetch all songs of the currently logged-in user, sorted by artistName
const getAllSongsForUser = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query string
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    console.log('Fetching all songs for user:', userId);

    // Find all songs for the user, sorted by artistName in ascending order
    const songs = await Music.find({ userIds: userId }).sort({ artistName: 1 });

    if (!songs.length) {
      return res.status(404).json({ msg: 'No songs found for this user.' });
    }

    res.json(songs);
  } catch (error) {
    console.error('Error fetching all songs for user:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Fetch all songs of a user without requiring authentication
const getAllSongsByUserNoAuth = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query string

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    console.log('Fetching all songs for user without auth:', userId);

    // Find all songs for the user, sorted by artistName in ascending order
    const songs = await Music.find({ userIds: userId }).sort({ artistName: 1 });

    if (!songs.length) {
      return res.status(404).json({ msg: 'No songs found for this user.' });
    }

    res.json(songs);
  } catch (error) {
    console.error('Error fetching all songs for user without auth:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const addToQueue = async (req, res) => {
  try {
    const { songId, userId, status } = req.body; // Receive status from the frontend

    // Log the incoming request body for debugging
    console.log('Request body:', req.body);

    // Validate songId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ msg: 'Invalid song ID.' });
    }

    // Validate userId if provided
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    // Find the song in the Music collection
    const song = await Music.findById(songId);
    if (!song) {
      return res.status(404).json({ msg: 'Song not found.' });
    }

    // Create a new entry in the Queue collection with songId, userId, and status
    const newQueueEntry = new Queue({
      songId: song._id,
      userId: userId || null, 
      status: status // Use the status sent from the frontend
    });

    // Save the queue entry
    await newQueueEntry.save();

    res.status(201).json({ msg: 'Song added to queue successfully.' });
  } catch (error) {
    console.error('Error adding song to queue:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};



// Fetch all songs in the queue for a specific user with status 1
const getQueueSongsForUser = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userId from query parameters

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    // Find all queue entries for the given userId and status 1
    const queueEntries = await Queue.find({ userId, status: 1 }).populate('songId');

    if (!queueEntries.length) {
      return res.status(404).json({ msg: 'No songs with status 1 found in the queue for this user.' });
    }

    // Extract songs from queue entries
    const songs = queueEntries.map(entry => entry.songId);

    res.json(songs);
  } catch (error) {
    console.error('Error fetching queue songs:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Fetch all songs in the queue for a specific user with status 1
const getQueueSongsRequests = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userId from query parameters

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    // Find all queue entries for the given userId and status 1
    const queueEntries = await Queue.find({ userId, status: 0 }).populate('songId');

    if (!queueEntries.length) {
      return res.status(404).json({ msg: 'No songs with status 0 found in the queue for this user.' });
    }

    // Extract songs from queue entries
    const songs = queueEntries.map(entry => entry.songId);

    res.json(songs);
  } catch (error) {
    console.error('Error fetching queue songs:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Update song status from 0 to 1
const updateSongStatus = async (req, res) => {
  try {
    const { songId } = req.body; // Extract songId from the request body

    // Validate songId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ msg: 'Invalid song ID.' });
    }

    // Find the queue entry for the song and user
    const queueEntry = await Queue.findOne({ songId, status: 0 });

    if (!queueEntry) {
      return res.status(404).json({ msg: 'Queue entry not found or already updated.' });
    }

    // Update status to 1
    queueEntry.status = 1;
    await queueEntry.save();

    res.json({ msg: 'Song status updated to 1 successfully.' });
  } catch (error) {
    console.error('Error updating song status:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { getSongsByPlaylist, getAllSongsForUser, getAllSongsByUserNoAuth, addToQueue, getQueueSongsForUser, getQueueSongsRequests, updateSongStatus };

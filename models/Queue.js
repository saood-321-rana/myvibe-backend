const mongoose = require('mongoose'); // Ensure mongoose is imported
const Schema = mongoose.Schema; // Destructure Schema from mongoose

const QueueSchema = new Schema({
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music', 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // User ID is optional
    },
    status: {
      type: Number,
      required: true, // Status is required
      default: 0 // Default to 0 if not provided
    },
    addedAt: {
      type: Date,
      default: Date.now,
    }
  });
  
  module.exports = mongoose.model('Queue', QueueSchema);
  
// models/pomodoroSession.js
const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: Number, // in minutes
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PomodoroSession', pomodoroSchema);

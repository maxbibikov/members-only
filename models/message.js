const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  title: { type: String, maxlength: 30, required: true },
  text: { type: String, maxlength: 300, required: true },
  date: { type: String, default: new Date().toUTCString() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Message', MessageSchema);

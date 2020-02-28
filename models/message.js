const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  title: { type: String, maxlength: 30, required: true },
  text: { type: String, maxlength: 300, required: true },
  date: { type: Date, default: new Date().toUTCString() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Virtual for message url
MessageSchema.virtual('url').get(function() {
  return `/message/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);

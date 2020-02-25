const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true, maxlength: 60 },
  username: { type: String, required: true, maxlength: 20 },
  password: { type: String, required: true, maxlength: 100 },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
    required: true,
  },
  membership_end: { type: String, default: new Date().toUTCString() },
});

// Virtrual to check if membership is active
UserSchema.virtual('activeMember').get(function() {
  const currentDate = new Date();
  const membershipEndDate = new Date(this.membership_end);

  return membershipEndDate > currentDate;
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

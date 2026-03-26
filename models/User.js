const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tier: { type: String, default: "Alpha Citizen" },
  joined: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
});

module.exports = mongoose.model('User', UserSchema);
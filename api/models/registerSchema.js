const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment=require('moment');
const registerSchema = new mongoose.Schema({
  PlayerName: {
    type: String,
    required: true,
    unique: true,
    trim: true // optional: removes whitespace from beginning and end of string
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true // optional: removes whitespace from beginning and end of string
  },
  Password: {
    type: String,
    required: true
  },
  IsActive: {
    type: Boolean,
    default: true
  },
  CreatedAt: {
    type: String,
    required:true
}
});
const User = mongoose.model('User', registerSchema);
module.exports = User;
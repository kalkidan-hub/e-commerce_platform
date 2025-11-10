const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Customer', 'Admin'],
      default: 'Customer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);


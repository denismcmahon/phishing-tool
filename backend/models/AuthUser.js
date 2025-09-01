const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuthUser', authUserSchema);

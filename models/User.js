// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  birthday: { type: Date, required: true },
  address: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);

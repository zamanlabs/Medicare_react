const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: [
      'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donor = mongoose.model('Donor', donorSchema);
module.exports = Donor;
const mongoose = require('mongoose');

const emergencyContactSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    relationship: {
      type: String,
      required: [true, 'Please add a relationship'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema); 
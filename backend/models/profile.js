const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
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
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer not to say'],
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      default: 'unknown',
    },
    height: {
      type: Number, // in cm
    },
    weight: {
      type: Number, // in kg
    },
    medicalConditions: [
      {
        type: String,
      },
    ],
    allergies: [
      {
        type: String,
      },
    ],
    emergencyContact: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
    insuranceDetails: {
      provider: {
        type: String,
      },
      policyNumber: {
        type: String,
      },
      expiryDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field before saving
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema); 
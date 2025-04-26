const Profile = require('../models/Profile');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  
  res.status(200).json(profile);
});

// @desc    Create user profile
// @route   POST /api/profile
// @access  Private
const createProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    age,
    bloodGroup,
    dateOfBirth,
    gender,
    height,
    weight,
    medicalConditions,
    allergies,
    emergencyContact,
    insuranceDetails,
  } = req.body;
  
  // Check if profile already exists
  const profileExists = await Profile.findOne({ user: req.user.id });
  
  if (profileExists) {
    res.status(400);
    throw new Error('Profile already exists');
  }
  
  // Validate required fields
  if (!fullName || fullName.trim().length < 2) {
    res.status(400);
    throw new Error('Full name must be at least 2 characters');
  }
  
  if (age && (age <= 0 || age > 120)) {
    res.status(400);
    throw new Error('Age must be between 1 and 120');
  }
  
  if (bloodGroup) {
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'];
    if (!validBloodGroups.includes(bloodGroup)) {
      res.status(400);
      throw new Error('Invalid blood group. Please select a valid option.');
    }
  }
  
  // Map frontend field names to backend model field names
  const profileData = {
    user: req.user.id,
    name: fullName, // Map fullName to name
    bloodType: bloodGroup, // Map bloodGroup to bloodType
    dateOfBirth: dateOfBirth || (age ? new Date(new Date().setFullYear(new Date().getFullYear() - age)) : undefined),
    gender,
    height,
    weight,
    medicalConditions: medicalConditions || [],
    allergies: allergies || [],
    emergencyContact,
    insuranceDetails,
  };
  
  try {
    const profile = await Profile.create(profileData);
    
    if (profile) {
      res.status(201).json(profile);
    } else {
      res.status(400);
      throw new Error('Invalid profile data');
    }
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      res.status(400);
      throw new Error(messages.join('. '));
    }
    throw err;
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  
  // Map frontend field names to backend model field names if they exist
  const updateData = { ...req.body };
  
  // Validate required fields
  if (updateData.fullName !== undefined) {
    if (updateData.fullName.trim().length < 2) {
      res.status(400);
      throw new Error('Full name must be at least 2 characters');
    }
    updateData.name = updateData.fullName;
    delete updateData.fullName;
  }
  
  if (updateData.bloodGroup) {
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'];
    if (!validBloodGroups.includes(updateData.bloodGroup)) {
      res.status(400);
      throw new Error('Invalid blood group. Please select a valid option.');
    }
    updateData.bloodType = updateData.bloodGroup;
    delete updateData.bloodGroup;
  }
  
  if (updateData.age) {
    if (updateData.age <= 0 || updateData.age > 120) {
      res.status(400);
      throw new Error('Age must be between 1 and 120');
    }
    updateData.dateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - updateData.age));
    delete updateData.age;
  }
  
  // Handle empty strings for enum fields
  if (updateData.gender === '') {
    delete updateData.gender; // Remove empty gender rather than sending invalid value
  }
  
  // Remove any other empty string values from fields that might have validation
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === '') {
      delete updateData[key];
    }
  });
  
  // Log what we're trying to update for debugging
  console.log('Updating profile with data:', updateData);
  
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('Updated profile:', updatedProfile);
    res.status(200).json(updatedProfile);
  } catch (err) {
    // Handle mongoose validation errors
    console.error('Profile update error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      res.status(400);
      throw new Error(messages.join('. '));
    }
    throw err;
  }
});

// @desc    Add medical condition to profile
// @route   PUT /api/profile/medical-condition
// @access  Private
const addMedicalCondition = asyncHandler(async (req, res) => {
  const { condition } = req.body;
  
  if (!condition) {
    res.status(400);
    throw new Error('Please provide a condition');
  }
  
  const profile = await Profile.findOne({ user: req.user.id });
  
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  
  // Check if condition already exists
  if (profile.medicalConditions.includes(condition)) {
    res.status(400);
    throw new Error('Condition already exists');
  }
  
  profile.medicalConditions.push(condition);
  await profile.save();
  
  res.status(200).json(profile);
});

// @desc    Remove medical condition from profile
// @route   DELETE /api/profile/medical-condition/:index
// @access  Private
const removeMedicalCondition = asyncHandler(async (req, res) => {
  const index = req.params.index;
  
  const profile = await Profile.findOne({ user: req.user.id });
  
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  
  if (index < 0 || index >= profile.medicalConditions.length) {
    res.status(400);
    throw new Error('Invalid condition index');
  }
  
  profile.medicalConditions.splice(index, 1);
  
  await profile.save();
  
  res.status(200).json(profile);
});

// @desc    Add allergy to profile
// @route   PUT /api/profile/allergy
// @access  Private
const addAllergy = asyncHandler(async (req, res) => {
  const { allergy } = req.body;
  
  if (!allergy) {
    res.status(400);
    throw new Error('Please provide an allergy');
  }
  
  const profile = await Profile.findOne({ user: req.user.id });
  
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  
  // Check if allergy already exists
  if (profile.allergies.includes(allergy)) {
    res.status(400);
    throw new Error('Allergy already exists');
  }
  
  profile.allergies.push(allergy);
  await profile.save();
  
  res.status(200).json(profile);
});

// @desc    Remove allergy from profile
// @route   DELETE /api/profile/allergy/:index
// @access  Private
const removeAllergy = asyncHandler(async (req, res) => {
  const index = req.params.index;
  
  const profile = await Profile.findOne({ user: req.user.id });
  
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  
  if (index < 0 || index >= profile.allergies.length) {
    res.status(400);
    throw new Error('Invalid allergy index');
  }
  
  profile.allergies.splice(index, 1);
  
  await profile.save();
  
  res.status(200).json(profile);
});

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  addMedicalCondition,
  removeMedicalCondition,
  addAllergy,
  removeAllergy
}; 
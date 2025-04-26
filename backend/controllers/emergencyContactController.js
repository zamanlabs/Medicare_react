const asyncHandler = require('express-async-handler');
const EmergencyContact = require('../models/emergencyContactSchema');
const User = require('../models/user');

// @desc    Get all emergency contacts for a user
// @route   GET /api/emergency-contacts
// @access  Private
const getEmergencyContacts = asyncHandler(async (req, res) => {
  const contacts = await EmergencyContact.find({ user: req.user.id });
  res.status(200).json(contacts);
});

// @desc    Create a new emergency contact
// @route   POST /api/emergency-contacts
// @access  Private
const createEmergencyContact = asyncHandler(async (req, res) => {
  const { name, relationship, phone } = req.body;
  console.log('Create Emergency Contact - Request body:', req.body);
  console.log('Create Emergency Contact - User ID:', req.user?.id || 'Not provided');

  if (!name || !relationship || !phone) {
    console.log('Create Emergency Contact - Missing required fields');
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    const contact = await EmergencyContact.create({
      user: req.user.id,
      name,
      relationship,
      phone,
    });
    
    console.log('Create Emergency Contact - Successfully created contact:', contact._id);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Create Emergency Contact - Database error:', error.message);
    res.status(500);
    throw new Error('Server error creating contact: ' + error.message);
  }
});

// @desc    Update an emergency contact
// @route   PUT /api/emergency-contacts/:id
// @access  Private
const updateEmergencyContact = asyncHandler(async (req, res) => {
  const contact = await EmergencyContact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Emergency contact not found');
  }

  // Check if user owns the contact
  if (contact.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this contact');
  }

  const updatedContact = await EmergencyContact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
});

// @desc    Delete an emergency contact
// @route   DELETE /api/emergency-contacts/:id
// @access  Private
const deleteEmergencyContact = asyncHandler(async (req, res) => {
  const contact = await EmergencyContact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Emergency contact not found');
  }

  // Check if user owns the contact
  if (contact.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this contact');
  }

  await contact.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
}; 
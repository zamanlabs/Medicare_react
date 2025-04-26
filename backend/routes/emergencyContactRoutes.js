const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} = require('../controllers/emergencyContactController');

// Routes for /api/emergency-contacts
router.route('/')
  .get(protect, getEmergencyContacts)
  .post(protect, createEmergencyContact);

// Routes for /api/emergency-contacts/:id
router.route('/:id')
  .put(protect, updateEmergencyContact)
  .delete(protect, deleteEmergencyContact);

module.exports = router; 
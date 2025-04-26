const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  createProfile,
  updateProfile,
  addMedicalCondition,
  removeMedicalCondition,
  addAllergy,
  removeAllergy,
} = require('../controllers/profileController');

// Base profile routes
router.route('/')
  .get(protect, getProfile)
  .post(protect, createProfile)
  .put(protect, updateProfile);

// Medical conditions routes
router.route('/medical-condition')
  .put(protect, addMedicalCondition);

router.route('/medical-condition/:index')
  .delete(protect, removeMedicalCondition);

// Allergies routes
router.route('/allergy')
  .put(protect, addAllergy);

router.route('/allergy/:index')
  .delete(protect, removeAllergy);

module.exports = router; 
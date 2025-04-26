//donor routes 
const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorCont');

// Routes
router.post('/', donorController.createDonor);
router.get('/read', donorController.getDonors);
router.get('/get/:id', donorController.getDonorById);
router.post('/update/:id', donorController.updateDonor);
router.post('/delete/:id', donorController.deleteDonor);

module.exports = router;

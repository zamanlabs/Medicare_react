//blood donor controller 
  const Donor = require('../models/donorSchema');

// Create a new donor
exports.createDonor = async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all donors
exports.getDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single donor by ID
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a donor
exports.updateDonor = async (req, res) => {
  try {
    const updated = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Donor not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a donor
exports.deleteDonor = async (req, res) => {
  try {
    const deleted = await Donor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Donor not found' });
    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

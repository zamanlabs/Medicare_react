const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentCont');
const { protect } = require('../middleware/authMiddleware'); // Ensure user is authenticated
  
 
router.post('/', protect, appointmentController.createAppointment);
  

router.get('/me', protect, appointmentController.getMyAppointments);
  

//   router.get('/:id', protect, appointmentController.getAppointmentById);
  

//   router.post('/update/:id', protect, appointmentController.updateAppointment);
  

router.post('/delete/:id', protect, appointmentController.deleteAppointment);
  
module.exports = router;
  
  
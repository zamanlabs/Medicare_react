
  const Appointment = require('../models/appointmentSchema');


  exports.createAppointment = async (req, res) => {
      try {
          const appointment = new Appointment({
              user: req.user.id, // Assuming authMiddleware adds user info
              ...req.body,
          });
          await appointment.save();
          res.status(201).json(appointment);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  };
  

  exports.getMyAppointments = async (req, res) => {
      try {
          const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1 });
          res.status(200).json(appointments);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  };

  exports.deleteAppointment = async (req, res) => {
      try {
          const appointment = await Appointment.findOneAndDelete({
              _id: req.params.id,
              user: req.user.id, 
          });
  
          if (!appointment) {
              return res.status(404).json({ message: 'Appointment not found or unauthorized' });
          }
  
          res.status(200).json({ message: 'Appointment deleted successfully' });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  };
  
  
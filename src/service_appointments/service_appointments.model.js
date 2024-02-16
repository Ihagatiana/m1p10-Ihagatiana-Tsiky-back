const mongoose = require('mongoose');

const serviceAppointmentSchema = new mongoose.Schema({
  id_appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments', required: true }, 
  id_service: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true }
});

const service_appointments = mongoose.model('service_appointments', serviceAppointmentSchema);

module.exports = service_appointments;

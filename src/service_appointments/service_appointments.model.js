const mongoose = require('mongoose');

const serviceAppointmentSchema = new mongoose.Schema({
  appointments: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments', required: true }, 
  services: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true },
  clients: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true }

});

const service_appointments = mongoose.model('service_appointments', serviceAppointmentSchema);

module.exports = service_appointments;

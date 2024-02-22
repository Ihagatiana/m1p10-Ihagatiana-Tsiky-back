const mongoose = require('mongoose');

const appointmentsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  clients: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true }, 
  starttime: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
  },
  state: { type: Number, required: true }
});

const Appointments = mongoose.model('appointments', appointmentsSchema);

module.exports = Appointments;
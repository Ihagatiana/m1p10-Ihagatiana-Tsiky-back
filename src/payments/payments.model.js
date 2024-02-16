const mongoose = require('mongoose');

const paymentsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  id_client: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true }],
  id_appointment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointments', required: true }],
});

const payments = mongoose.model('payments', paymentsSchema);

module.exports = payments; 
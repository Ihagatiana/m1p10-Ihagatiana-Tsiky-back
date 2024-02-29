const mongoose = require('mongoose');

const paymentsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  clients: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true },
  appservices: { type: mongoose.Schema.Types.ObjectId, ref: 'appservices', required: true },
  amount: {type:Number, required: true }
});

const payments = mongoose.model('payments', paymentsSchema);

module.exports = payments; 
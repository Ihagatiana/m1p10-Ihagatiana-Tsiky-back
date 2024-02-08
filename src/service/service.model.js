const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  duree: { type: Number, required: true },
  commission: { type: Number, required: true }
});

const service = mongoose.model('Service', serviceSchema);

module.exports = service;
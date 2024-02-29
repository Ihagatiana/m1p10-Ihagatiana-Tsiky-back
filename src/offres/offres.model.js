const mongoose = require('mongoose');

const offresSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  services: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true },
  percentage: { type: Number, required: true, default:0}
});

const offres = mongoose.model('offres', offresSchema);

module.exports = offres; 


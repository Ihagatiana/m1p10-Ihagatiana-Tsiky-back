const mongoose = require('mongoose');

const appservicesSchema = new mongoose.Schema({
  appointments: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments', required: true }, 
  services: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true },
  employes: { type: mongoose.Schema.Types.ObjectId, ref: 'employes', required: true },
  starttime: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
  },
  endtime: { 
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
   },
  order:{ type: Number, required: true }
});

const appServices = mongoose.model('appservices', appservicesSchema);

module.exports = appServices;
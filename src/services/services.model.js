const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration:  {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
  },
  description: { type: String, required: true },
  commission : {type:Number, required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images', required: false }]
});

const services = mongoose.model('services', servicesSchema);

module.exports = services; 


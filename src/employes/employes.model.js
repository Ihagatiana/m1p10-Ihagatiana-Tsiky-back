const mongoose = require('mongoose');

const employesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  photo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images', required: false }],
  credential: { type: mongoose.Schema.Types.ObjectId, ref: 'credentials', required: true },
  starttime: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
  },
  endtime: { 
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
   }
});

const employes = mongoose.model('employes', employesSchema);

module.exports = employes;

const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String, required: true }
});

const images = mongoose.model('images', imagesSchema);

module.exports = images;
// Importez Mongoose
const mongoose = require('mongoose');

const managersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  photo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images', required: false }],
  id_credential: { type: mongoose.Schema.Types.ObjectId, ref: 'credentials', required: true },
});

const managers = mongoose.model('managers', managersSchema);

module.exports = managers;

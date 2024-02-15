const mongoose = require('mongoose');

const managersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: Number, required: true },
  photo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images', required: false }],
  credential: [{ type: mongoose.Schema.Types.ObjectId, ref: 'credentials', required: false }],
});

const managers = mongoose.model('managers', managersSchema);

module.exports = managers;
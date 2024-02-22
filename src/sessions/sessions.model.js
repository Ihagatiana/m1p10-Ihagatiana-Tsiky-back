const mongoose = require('mongoose');

const sessionsSchema = new mongoose.Schema({
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  credential: { type: mongoose.Schema.Types.ObjectId, ref: 'credentials', required: true },
  token: { type: String, required: true },
  date: { type: String, required: true },
  name: { type: String, required: true },
  photo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images', required: false }],
  roles: { type: String, enum:  ['manager', 'client', 'employe'], default: 'client' }
});

const Sessions = mongoose.model('sessions', sessionsSchema);

module.exports = Sessions;

 
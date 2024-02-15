const mongoose = require('mongoose');

const sessionsSchema = new mongoose.Schema({
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  id_credential: { type: mongoose.Schema.Types.ObjectId, ref: 'credentials', required: true },
});

const Sessions = mongoose.model('sessions', sessionsSchema);

module.exports = Sessions;

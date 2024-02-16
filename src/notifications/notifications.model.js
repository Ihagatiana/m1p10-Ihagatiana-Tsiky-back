const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true },
  description: { type: String, required: true },
});

const notifications = mongoose.model('notifications', notificationsSchema);

module.exports = notifications;

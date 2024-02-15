const mongoose = require('mongoose');

const credentialsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: String, enum:  ['manager', 'client', 'employe'], default: ['client'] },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  codeActivation: { type: String },
  codeActivationExpiration: { type: Date },
  codeResetPassword: { type: String },
  codeResetPasswordExpiration: { type: Date },
});

const credentials = mongoose.model('credentials', credentialsSchema);

module.exports = credentials;

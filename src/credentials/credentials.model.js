const mongoose = require('mongoose');


const credentialsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: String, enum:  ['manager', 'client', 'employe'], default: 'client' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  codeActivation: { type: String , default: null },
  codeActivationExpiration: { type: Date , default: null },
  codeResetPassword: { type: String , default: null },
  codeResetPasswordExpiration: { type: Date , default: null },
});



const credentials = mongoose.model('credentials', credentialsSchema);

module.exports = credentials;

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
require('mongoose-type-email');

const userSchema = new Schema({
  username: String,
  password: String,
  status: { type: String, enum:['Pending Confirmation', 'Active'], default: 'Pending Confirmation' },
  confirmationCode: { type: String, unique: true },
  email: { type: mongoose.SchemaTypes.Email }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

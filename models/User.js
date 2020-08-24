const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  confirmationCode: String,
  status: Boolean
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Comparar la contraseña para validarla
userSchema.methods.checkPass = function (pass) {
  return bcrypt.compare(pass, this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User;

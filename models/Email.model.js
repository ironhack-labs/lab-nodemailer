const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: 'Es necesario añadir un correo electrónico',
      unique: true,
      lowercase: true,
      match: [EMAIL_PATTERN, 'Email inválido'],
      trim: true
    },
    password: {
      type: String,
      required: 'La contraseña es requerida',
      match: [PASSWORD_PATTERN, 'Tu contraseña debe conteneral menos 1 número, 1 mayúscula, 1 minúscula y 8 caracteres']
    },
    status: {
      type: String,
      required: true,
      enum:["Pending Confirmation", "Active"],
      default: "Pending Confirmation"
    },
    confrimationCode: {
      confrimationCode: Number,
    }
  }
)

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model('User', userSchema)
module.exports = User;
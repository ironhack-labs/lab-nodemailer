const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation'
  },
  confirmationCode: { type: String, unique: true },
  email: {
    type: String,
    validate: {
      validator: mailValidate,
      message: props => `${props.value} No es un email correcto`
    }
  }
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;


function mailValidate(v) {
  return /^[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v)
}
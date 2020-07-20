const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const generateRandomToken = () => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  return token
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Username is required']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    status: {
      type: String,
      enum: ['Pending Confirmation', 'Active'],
      default: 'Pending Confirmation'
    },
    confirmationCode: {
      type: String,
      default: generateRandomToken
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [EMAIL_PATTERN, 'Email is invalid']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User
// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const randomCode = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }
    return token
}
  
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    status: {
        type: String,
        enum: ["false", "active"],
        default : "false"
      },
      confirmationCode : {
        type: String,
        unique : true,
        default: randomCode
      },
      email:  {
        type: String,
        required: true
      }
    }, {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
})

userSchema.pre('save', function(next) {
    if (this.status === 'false'){
      bcrypt.hash(this.password, 10)
          .then ((hash) => {
              this.password = hash
              next()
          })
    } else {
      next()
    }
})

userSchema.methods.comparePassword = function (password) {
  console.log(password);
  console.log(this.password);
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
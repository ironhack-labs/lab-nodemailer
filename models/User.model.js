const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
const SALT_FACTOR = 10
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, 'Provide a valid email']
    },
   /* username: { 
        type: String,
        default: '"You should have gotten a username. To late pal"'
        // TODO: poner que no sea pattrern de email y que sea unico en el controlador
    }, */
    password: {
        type: String,
        required: [true, 'Password is required'],
        match: [PASSWORD_PATTERN, 'Password must contain 8 characters, one lowercase, one capital letter and one number']
    },
    active: {
       type: Boolean,
       default: false 
    },
    activationToken: {
        type: String,
        default: () => {
           return ( // TODO: Refrescar token de activación
            uuidv4()
           )
        }
    }
})

userSchema.methods.checkPassword = function(passwordIn) {
    return bcrypt.compare(passwordIn, this.password) 
}

userSchema.pre('save', function(next) {
    
    if(this.isModified('password')) {
        bcrypt.hash(this.password, SALT_FACTOR)
        .then(hashedPass => {
            this.password = hashedPass
            next()
        })
    } else {
        next()
    }
})


const User = mongoose.model('User', userSchema)
module.exports = User
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const USERNAME_PATTERN = /^[a-z0-9_-]{3,15}$/
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@“]+(\.[^<>()[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Es necesario introducir un nombre',
        maxlength: [100, 'El nombre es demasiado largo'],
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: 'Es necesario introducir un nombre de usuario',
        minlength: [5, 'El nombre de usuario debe contener al menos 5 caracteres'],
        maxlength: [15, 'El nombre de usuario debe contener máximo 15 caracteres'],
        match: [USERNAME_PATTERN, 'El nombre de usuario contiene caracteres no válidos']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: 'Es necesario introducir un correo electrónico',
        match: [EMAIL_PATTERN, 'El email contiene caracteres no válidos']
    },
    password: {
        type: String,
        trim: true,
        required: 'Es necesario introducir una contraseña',
        maxlength: [50, 'La contraseña es demasiado larga (Máximo 50 caracteres)'],
        minlength: [6, 'La contraseña es demasiado corta (Mínimo 6 caracteres)']
    },
    active: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: uuidv4()
    }
}, { timestamps: true })

userSchema.methods.checkPassword = function(pass){
    return bcrypt.compare(pass, this.password)
}

userSchema.pre('save', function(next) {
    if(this.isModified('password')){
        bcrypt.hash(this.password, SALT_ROUNDS)
            .then(hash => {
                this.password = hash
                next()
            })
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
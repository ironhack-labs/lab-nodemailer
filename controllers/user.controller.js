const mongoose = require('mongoose');
const User = require('../models/User.model');
const { sendActivationEmail } = require("../configs/mailer.config");

module.exports.register = (req, res, next) => {
    res.render('user/register')
}

module.exports.doRegister = (req, res, next) => {

    function renderWithErrors(errors) {
        res.status(400).render('user/register', {
            errors: errors,
            user: req.body
        })
    }

    User
        .findOne({ username: req.body.username })
        .then(user => {
            if(user){
                renderWithErrors({
                    username: 'Ya existe un usuario con este nombre de usuario'
                })
            } else {
                User
                    .create(req.body)
                    .then(u => {
                        sendActivationEmail(u.email, u.token, u.username)
                        res.redirect('/')
                    })
                    .catch(e => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithErrors(e.errors)
                        } else {
                            next(e)
                        }
                    })
                
            }
        })
}

module.exports.login = (req, res, next) => {
    res.render('user/login')
}

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('user/login', {
            errors,
            user: req.body
        })
    }
    
    if(!req.body.username || !req.body.password){
        renderWithErrors('El usuario y la contraseña son obligatorios')
    } else {
        User
            .findOne({ username: req.body.username })
            .then((user) => {
                if(!user){
                    renderWithErrors('El usuario o la contraseña son incorrectos')
                } else {
                    if(user.active){
                        user.checkPassword(req.body.password)
                        .then(match => {
                            if(match){
                                req.session.currentUserId = user.id
                                res.redirect('../profile')
                            } else {
                                renderWithErrors('El usuario o la contraseña son incorrectos')
                            }
                        })
                    } else {
                        renderWithErrors('Debes verificar tu correo electrónico')
                    }
                }
            })
            .catch(e => next(e))
    }
}

module.exports.profile = (req, res, next) => {
    res.render('user/profile')
}

module.exports.doLogout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}

module.exports.activate = (req, res, next) => {
    const { token, username } = req.params
    if(token && username){
        User
            .findOneAndUpdate(
                { token: token, username: username }, 
                { active: true }, 
                { useFindAndModify: false })
            .then(user => {
                res.render('user/login', { user, message: "Felicidades, has activado tu cuenta. Ya puedes iniciar sesión" })
            })
            .catch(e => next(e))
    } else {
        res.redirect('/')
    }
}
const mongoose = require("mongoose")
const User = require("../models/User.model")
const {sendActivationEmail} = require ('../configs/mailer.cofig')

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

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: "Email already exists"
                })
            }
            else {
                User.create(req.body)
                    .then((u) => {
                        sendActivationEmail(u.email, u.confirmationCode)
                        res.redirect("/login")
                    })
                    .catch(e => {
                        if (e instanceof mongoose.Error.ValidationError) {  //Errores de validación del modelo
                            renderWithErrors(e.errors) // errors => objeto de los errores que se han dado
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch((e)=> next(e))
}

module.exports.login = (req, res, next) => {
    res.render ('user/login')
}

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors(error) {
        res.render('user/login', {
            user: req.body,
            error: error || "Email or password invalid",
        })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                renderWithErrors()
            } else {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            if (user.status) {
                                req.session.currentUserId = user.id
                                res.redirect('/profile')
                            } else {
                                renderWithErrors("Your account is not active, check your email")
                            }
                        } else {
                            renderWithErrors()
                        }
                })
            }
        })
        .catch((e) => next(e))
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}

module.exports.profile = (req, res, next) => {
    res.render('user/profile')
}

module.exports.main = (req, res, next) => {
    res.render('protectedRoutes/main')
}

module.exports.private = (req, res, next) => {
    res.render('protectedRoutes/private')
}

module.exports.activate = (req, res, next) => {
    User.findOneAndUpdate(
        { confirmationCode: req.params.code, status: false },
        { status: true, confirmationCode: "active" }
    )
        .then((u) => {
            if (u) {
                res.render('user/login', {
                    user: req.body,
                    message: "Congratulations, your account is ready",
                })
            } else {
                res.redirect("/")
            }
        })
        .catch((e) => next(e))
}
const mongoose = require('mongoose');
const User = require("../models/user.model")
const { sendActivationEmail } = require("../configs/mailer.config")

module.exports.register = (req, res, next) => {
    res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        console.log(errors)
        console.log(`error: ${errors.password}`)
        res.status(404).render('users/register', {
            errors: errors,
            user: req.body
        })
    }
    if (req.body.password !== req.body.repeatPassword) {
        renderWithErrors({
            password: 'Repeat password'
        })
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    renderWithErrors({
                        email: 'There is already a user with this email'
                    })
                } else {
                    User.create(req.body)
                        .then((user) => {
                            sendActivationEmail(user.email, user.activationToken)
                            res.redirect('/')
                        })
                        .catch((err) => {
                            if (err instanceof mongoose.Error.ValidationError) {
                                renderWithErrors(err.errors)
                            } else {
                                next(err)
                            }
                        })
                }
            })
            .catch(err => next(err))
    }
}

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors(e) {
        res.render('users/login', {
            user: req.body,
            error: e || 'The email or password is not correct'
        })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                renderWithErrors()
            } else {
                user.checkPassword(req.body.password)
                    .then(match => {
                        console.log('user: ' + user)
                        console.log('match: ' + match)
                        if (match) {
                            if (user.active) {
                                req.session.currentUserId = user.id
                                res.redirect('/profile')
                            } else {
                                renderWithErrors('Your account is not active, check your email')
                            }
                        } else {
                            renderWithErrors()
                        }
                    })
            }
        })
        .catch(e => next(e))
};

module.exports.profile = (req, res, next) => {
    res.render('users/profile')
};

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
};

module.exports.activate = (req, res, next) => {
    console.log('req.params.token ' + req.params.token)
    User.findOneAndUpdate(
        { activationToken: req.params.token, active: false},
        { active: true, activationToken: "active" }
    )
        .then((user) => {
            if (user) {
                res.render("users/login", {
                    user: req.body,
                    message: "Congratulations, you have activated your account. You can now log in.",
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((e) => next(e));
}
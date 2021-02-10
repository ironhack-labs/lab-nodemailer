const User = require('../models/User.model')
const mongoose = require('mongoose')
const { sendActivationEmail } = require('../configs/mailer.config')


module.exports.registerView = (req, res, next) => {
    res.render('user/register')
}

module.exports.registerThanks = (req, res, next) => {
    res.render('user/thanks')
}

module.exports.register = (req, res, next) => {
    function renderErrors(errors) {
        res.status(400).render('user/register', { 
            errors: errors,
            user: req.body
        })
    }

    User.findOne({ email: req.body.email }) 
        .then((u) => { 
            if (u) {                                                           
                renderErrors({ email: 'This email is already signed in'})
            } else if (req.body.password !== req.body.passwordRepeat) {
                renderErrors({ password: 'Please insert the same password'})
            } else {                                                           
                User
                    .create(req.body)
                    .then((u) => {
                        sendActivationEmail(u.email, u.activationToken)

                        res.redirect('/thanks')
                    })
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderErrors(e.errors)                              
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch((e) => next(e))

}

module.exports.loginView = (req, res, next) => {
    res.render('user/login')
}

module.exports.login = (req, res, next) => {
    function renderErrors(e) { 
        res.status(400).render('user/login', { 
            errors: e || 'The email or the password are not correct',
            user: req.body
        })
    }

    User.findOne({ email: req.body.email })
      .then((u) => {
          console.log(u)
          if(!u) {
              renderErrors()
          } else {
              u.checkPassword(req.body.password)
              .then((same) => {                                         
                if (same) {
                    if(u.active) {
                        req.session.currentId = u.id
                        res.redirect('../in')
                    } else {
                        renderErrors('This account is not yet active. Check the email inbox')
                    }
                } else {
                    renderErrors()
                }
              })
          }

      })
      .catch(e => next(e))
}

module.exports.in = ((req, res, next) => {
    res.render('user/in')
})

module.exports.logout = ((req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}) 

module.exports.activate = ((req, res, next) => {
    User.findOneAndUpdate(
        { activationToken: req.params.token, active: false },
        { active: true, activationToken: 'done' }
    )
    .then((u) => {
        if (u) {
            res.render('user/login', { 
                user: req.body,
                message: 'Your account is now active. Please login.'
            })
        } else {
            res.render('user/login', { message: 'Register'})
        }
    })
    .catch(e => next(e))
})
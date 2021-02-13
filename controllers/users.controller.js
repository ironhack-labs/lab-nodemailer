const mongoose = require("mongoose")
const User = require("../models/user.model")
const { sendActivationEmail } = require("../configs/mailer.config");


module.exports.register = (req, res, next) => {
  res.render('users/signup')
}

module.exports.doRegister = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render('users/signup', {
      errors: errors,
      user: req.body
    })
  }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        renderWithErrors({
          username: 'This username already exist'
        })
      } else {
        User.create(req.body)
          .then((user) => {
            sendActivationEmail(user.email, user.confirmationCode);
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
    .catch(e => next(e))
}

module.exports.login = (req, res, next) => {
  res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
  function renderWithErrors() {
    res.render('users/login', {
      user: req.body,
      error: 'Username or pasword are incorrect'
    })
  }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        renderWithErrors()
      } else {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              req.session.currentUserId = user.id

              res.redirect('/profile')
            } else {
              renderWithErrors()
            }
          })
      }
    })
    .catch(e => next(e))
}

module.exports.profile = (req, res, next) => {
  res.render('users/profile')
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}

module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.token, status: 'Pending Confirmation' },
    { status: 'Active' }
  )
    .then((u) => {
      if (u) {
        res.render("users/login", {
          user: req.body,
          message: "Congrats, your account is activated",
        });
      } else {
        res.redirect("/")
      }
    })
    .catch((e) => next(e));
};

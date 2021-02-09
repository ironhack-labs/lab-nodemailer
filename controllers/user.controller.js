const mongoose = require("mongoose")
//require model
const User = require("../models/User.model")
const { sendActivationEmail } = require("../configs/mailer.config");


//Show user signUp
module.exports.register = (req,res,next) => {
    res.render('authentication/auth_form')
}

//Create user
module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
      res.status(400).render('authentication/auth_form', {
        errors: errors,
        user: req.body
      })
    }
  
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          renderWithErrors({
            email: 'Ya existe un usuario con este email'
          })
        } else {
          User.create(req.body)
            .then(user => {
              sendActivationEmail(user.email, user.activationToken)
              res.render('index', {...req.body, message: "Registro finalizado"})
              //res.redirect('/')
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


//user login
module.exports.login = (req,res,next) => {
  res.render('authentication/login_form')
}


module.exports.doLogin = (req, res, next) => {
  function renderWithErrors() {
    res.render('/authentication/login_form', {
      user: req.body,
      error: 'El correo electrónico o la contraseña no son correctos'
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

//profile
module.exports.profile = (req, res, next) => {
  res.render('authentication/profile')
}

//logout
module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}

//activate Token
module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    { activationToken: req.params.token, active: false },
    { active: true, activationToken: "active" }
  )
    .then((u) => {
      if (u) {
        res.render('authentication/login_form', {
          user: req.body,
          message: "Felicidades, has activado tu cuenta. Ya puedes iniciar sesión",
        });
      } else {
        res.redirect("/")
      }
    })
    .catch((e) => next(e));
};

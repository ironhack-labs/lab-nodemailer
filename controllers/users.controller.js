const mongoose = require("mongoose")
const User = require("../models/User.model")
const { sendActivationEmail } = require("../configs/mailer.config")

module.exports.register = (req, res, next) => {
  res.render('users/register')
}

module.exports.doRegister = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render('users/register', {
      errors: errors, 
      user: req.body
    })
  }

  //Check the username and email does not already exist in the db
  User.find({username:req.body.username}) //Check unique username
    .then((user) => {
      if (user.length >0) {
        console.log(user)
        renderWithErrors({
          username: 'Ya existe un usuario con este nombre'
        })
      }
      else { 
        User.find({email:req.body.email})//Check unique email
        .then((email) => {
          if (email.length > 0) {
            renderWithErrors({
              email: 'Ya existe un email con este nombre'
            })
          }
          else{//Create the document
            User.create(req.body)
            .then((user) => {
              sendActivationEmail(user.email, user.activationToken);
              res.render('users/checkmail')
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
    })
    .catch(e => next(e))
}


//LOGIN

module.exports.login = (req, res, next) => {

  res.render('users/login')

}

module.exports.doLogin = (req, res, next) => {
  function renderWithErrors(){
    res.status(400).render('users/login',{
      user: req.body,
      error:'Username or password is incorrect!'
    })
  }
  User.findOne({ username: req.body.username })
    .then((user) => {
      //Check if the username is correct
      if(!user){
        renderWithErrors()
      }
      //check if the password is correct
      else{
        user.checkPassword(req.body.password)
          .then((passOk) => {
            if(!passOk){
              renderWithErrors()
            }else{
              req.session.currentUserId = user.id
              res.redirect('/profile') //Redirijo a mi página de sesión
            }
          })
          .catch((e) => next(e))
      }
    })
    .catch((e) => next(e))
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}

module.exports.profile = (req, res, next) => {
  res.render('users/profile')
}

module.exports.main = (req, res, next) => {
  res.render('private/main')
}

module.exports.private = (req, res, next) => {
  res.render('private/private')
}

//
module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    { activationToken: req.params.token, active: false },
    { active: true, activationToken: "active" }
  )
    .then((u) => {
      if (u) {
        res.render("users/login", {
          user: req.body,
          message: "Your account have been activated",
        });
      } else {
        res.redirect("/")
      }
    })
    .catch((e) => next(e));
};
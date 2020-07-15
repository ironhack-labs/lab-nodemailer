const User = require('../models/User.model')
const nodemailer = require('../configs/nodemailer.config')

exports.drawIndex = (req, res, next) => { res.render('index') }

exports.drawProfile = (req, res, next) => { 
  res.render('profile', req.currentUser)
}

exports.drawLogin = (req, res, next) => { res.render('login') }

exports.doLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        user.comparePassword(req.body.password)
          .then(match => {
            if (match) {
              // if (user.status === 'active') {
                req.session.userId = user._id
                res.redirect('/profile')
              // } else {
              //   res.render('login', {
              //   error: {
              //     password: {
              //       message: 'activate'
              //     }
              //   }
              // })
            //  }
            } else {
              res.render('login', {
                error: {
                  password: {
                    message: 'user not found-'
                  }
                }
              })
            }
          })
      } else {
        res.render('login', {
          error: {
            username: {
              message: 'user not found--'
            }
          }
        })
      }
    })
    .catch( e => res.send(e))
}

exports.drawSignup = (req, res, next) => { res.render('signup') }

exports.createUser = (req, res, next) => {
  const {username, password, email } = req.body
  if (username === "" || password === "" || email === '') {
    res.render("signup", { message: "Indicate username, password and email" });
    return;
  };


  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const newUser = new User({
      username,
      password,
      email
    });

    newUser.save()
    .then(() => {
      User.findOne({username})
        .then(user => {
          console.log(user)
          const {username, email, confirmationCode} = user
          nodemailer.sendEmail(username, email, confirmationCode)
          res.redirect("/login");
        })
        .catch(next)
    })
    .catch(err => {
      res.render("signup", { message: "Something went wrong" });
    })
  })
}

exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}
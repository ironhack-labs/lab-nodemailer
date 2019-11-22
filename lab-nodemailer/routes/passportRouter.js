const express = require('express')
const passportRouter = express.Router()
const passport = require('passport')
const {
  signupGet,
  signupPost,
  loginGet,
  confirmAccount,
  confScreen
} = require('../controllers/auth.controller')

passportRouter.get('/signup', signupGet)
passportRouter.post('/signup', signupPost)

passportRouter.get('/login', loginGet)

passportRouter.get("/profile", ensureLogin, (req, res) => {
  res.render("passport/profile", {
    user: req.user
  })
})

passportRouter.get('/conf-alert', confScreen)

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  })
)

passportRouter.get("/confirm/:confirmationCode", confirmAccount)

function ensureLogin(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect("/login")
}




module.exports = passportRouter
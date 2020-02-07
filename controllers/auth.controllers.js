const User = require('../models/User')
const {confirmAccount} = require('../config/nodemailer')
const passport = require('passport')


exports.signupView = (req,res,next) => {
  res.render('auth/signup')
}
exports.signupPost = async (req,res,next) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const {username, email, password} = req.body
  const confirmationCode = token
  const user = await User.register({username, email, confirmationCode}, password)
  await confirmAccount(
    email,
    `http://localhost:3000/confirm/${user.confirmationCode}`
  )
  res.render('auth/login', {msg: 'User Registered'})
}

exports.confirmView = async (req,res,next)=> {
  const {token:confirmationCode} = req.params
  const user = await User.findOneAndUpdate({confirmationCode}, {status: 'Active'}, {new: true})
  if(user){
    res.render('auth/confirm', {message: 'Vientos estas confirmado carnal'})
  } else {
    res.render('auth/signup', {message: 'No seas guarro no me robes'})
  }
}

exports.loginView = (req,res,next) => {
  res.render('auth/login')
}

exports.profileView = (req, res, next) => {
  const {username:name, status} = req.user
  res.render('auth/profile', {name, status})
}


exports.loginPost = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/profile'
})

exports.logout = (req,res,next) => {
  req.logout()
  res.redirect('/')
}

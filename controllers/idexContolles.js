const User = require ('../models/User')
const passport = require ('passport')
const { confirmAccount } = require ('../config/nodemailer')

exports.indexGet = (req, res, next) => res.render('index')

exports.signupPost = async (req, res, next) => {
  const { name, email, password } = req.body
  console.log('hola');
  const user = await User.register({ name, email }, password)
 
  
  await confirmAccount(
    email,
    `http://localhost:3000/auth/confirm/${user.confirmationCode}`
  )
  console.log( 'adios');
  
  res.render('index', { msg: 'User registered' })
}
exports.confirmGet = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(id, { active: true }, { new: true })
  res.redirect('/profile')
}
exports.profileGet = (req, res, next) => {
  const { user } = req
  console.log(user)
  res.render('profile', user)
}


exports.logout = (req, res, next) => {
  req.logout()
  res.redirect('/')
}
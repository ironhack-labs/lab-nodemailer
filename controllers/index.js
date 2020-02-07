const User = require('../models/User')
const passport = require('passport')
const {confirmAccount}=require("../config/nodemailer")

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
  token += characters[Math.floor(Math.random() * characters.length )];
}
exports.signupGet = (req, res, next) => res.render('auth/signup')
exports.signupPost = async (req,res,next) => {
  console.log("entra")
  const { username, email, password } = req.body

      let user = await User.register({ username, email, confirmationCode:token}, password)
      // console.log("creausuario")
    
      let endpoint=`http://localhost:3000/auth/confirm/${token}`
 await confirmAccount(email,
     endpoint
   )
  console.log("manda correo")
  res.redirect("/auth/login")
}

exports.loginGet=(req,res,next) => res.render("auth/login")



exports.confirmGet = async ( req, res, next)=> {
  const {confirmationCode} = req.params
  const user = await User.findOneAndUpdate({confirmationCode}, { status: "Active"}, {new: true})
  res.redirect('/auth/confirmation')
}

exports.confirmPageGet=(req,res,next)=>{
  res.render("auth/confirmation")
}

exports.profileGet = (req, res, next) => {
  const { user } = req
  console.log("login",req.user)
  res.render('auth/profile', user)
}


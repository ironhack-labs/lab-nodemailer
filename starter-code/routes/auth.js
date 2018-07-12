const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendMail = require('../helpers/mailer').sendWelcomeMail;

router.get('/signup', (req,res,next)=>{
  res.render('auth/signupForm');
})

router.post('/signup', (req,res,next)=>{
   //encriptar la contraseña
  const userHash = bcrypt.hashSync(req.body.username, bcrypt.genSaltSync(10));
  const userSinSlash = userHash.split("").filter(function(a){return a!=="/"}).join("")
  req.body.confirmationCode = userSinSlash;

  User.register(req.body, req.body.password)
  .then(user=>{
    sendMail(user)
    res.send('Creado')
  })
  .catch(e=>next(e));
})


router.get('/confirmed/:confirmationCode', (req,res,next)=>{
  const confirmationCode = req.params.confirmationCode;
  User.findOneAndUpdate({confirmationCode: confirmationCode},{$set:{active:true}})
  .then(user=>{
    res.render('auth/confirmation', user);
  })
  .catch(e=>next(e));
})

router.get('/profile/:id',(req,res,next)=>{
  User.findById(req.params.id)
  .then(user=>{
    if(req.params.active === true) return res.render('profile', user)
  })
})



//$2b$10$yBVIUA89dzeuVRxwDTjjTuRzRcF4Yp65GGUaX3/5qcRCLyGZuWX9S
module.exports = router;
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

  const {username, email, password} = req.body
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
    }

    User.create({username, email, password: hashPass, confirmationCode: token} )
    console.log(token)
    
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'cuentafalsa123ahoramasfalsa@gmail.com',
          pass: 'F4lsedad?'
        }
      });
    
    
      console.log(email)
      transporter.sendMail({
        from: '"Ironhacker Email 👻" <myawesome@project.com>',
        to: email,
        subject:'enviamos el token',
        text: `Hola Guapo`,
        html: `<a href=http://localhost:3000/auth/confirm/${token}>Pincha aqui</a>`
      })
        .then(info => res.render('message', { email, token: `http://localhost:3000/auth/confirm/${token}`, info }))
        .catch(error => console.log(error));

  });




});

router.get('/confirm/:confirmCode', (req,res,next) =>{
  User.find({confirmCode: req.params.confirmationCode})
  .then( elm => {
    elm.status = 'Active'
    console.log(elm)
    res.redirect('/auth/login')
  })
})




router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

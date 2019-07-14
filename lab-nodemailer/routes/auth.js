const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const nodemailer = require('nodemailer');


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
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
  const confirmationCode = token;
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

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
    .then(user => {
      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "64c987ff795ac5",
          pass: "3b275cbd89a63a"
        }
      });
      let { email, confirmationCode, username } = user;
      
      transporter.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email, 
        subject: 'Confirme o seu e-mail', 
        text: 'Mensagem qualquer',
        html: `<b>Awesome Message</b><br> <a href="http://localhost:3000/auth/confirm/${confirmationCode}"> Please click and verifify your e-mail account</a>`
      })
      .then(info => {
        const email = info.envelope.to;
        
        const msg = `E-mail sent to: ${email}`;
        res.render('message', {msg})
       
      })
      .catch(error => console.log(error))

     
    })
    .catch(err => {
      console.error('Error saving ', err);
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});


router.get('/confirm/:confirmationCode', (req, res) => {
  const confirmationCode = req.params.confirmationCode;
  User.updateOne({ confirmationCode: confirmationCode }, { status: 'Active' })
  .then(user => { 
    res.render('message', { msg: "User e-mail was validated!" })
  })
  .catch(err => { console.log('An error happened:', err) });


  
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

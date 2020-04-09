const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//nodemailer
const nodemailer = require('nodemailer');
// console.log(process.env.MAILTRAP_PASS, '<--------')
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

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
      email,
      password: hashPass,
      confirmationCode:generateConfirmationCode()
    })
    newUser.save()
      .then(user => {
        
      console.log(user);
  //firing the email
      transport.sendMail({
        from: '"Jon Snow App" <noreply@got.com>',
        to: user.email,
        subject: 'Welcome to GoTApp',
        text:'Welcome,confirm your account here http://localhost:3000/auth/confirm/',
         html: `http://localhost:3000/auth/confirm/${user.confirmationCode}`,
        // html: '<b>Welcome Message</b>'
      })
        .then(info => {
          console.log(sendMail)
          console.log('OIIIII')
          console.log(info)
          res.redirect('auth/login');
        })
        .catch(error => res.render('auth/signup', {
          errorMessage: error

        })
        
      )})
    .catch(err => res.status(400).render('auth/signup', {
      errorMessage: err.errmsg
    }));

  //   newUser.save()
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch(err => {
  //     res.render("auth/signup", { message: "Something went wrong" });
  //   })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmationCode', (req, res) => {
  const { confirmationCode } = req.params;


  User.findOneAndUpdate({confirmationCode: confirmationCode}, {status:'Active'}
  
  
  ).then(response => { 
    res.redirect("/");
  })
    .catch(error => console.log(error));
})

module.exports = router;

function generateConfirmationCode(){
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}
  return token;
}

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
//nodemailer

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_user,
    pass: process.env.MAIL_pass
  }
});

//LOGIN
router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

//profile
router.get("/profile", (req, res) => {
  res.render("auth/profile", {user: req.user});
  console.log(req.user)
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));



//SINGUP
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

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and your email" });
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
      confirmationCode: token,
    });

   newUser.save()
   .then(user => {
    console.log(user);
    // firing the email
    transporter.sendMail({
      from: '"My Awesome Project " <noreply@project.com>',
      to: user.email,
      subject: 'Welcome', 
      text: `<a href="http://localhost:3000/auth/confirm/${user.confirmationCode}"></a>`,
      html: '<b>Awesome Message</b>'
    })
    .then(user => {
      res.redirect('/');
    })
    .catch(error => res.render('signup', {
      errorMessage: error
    }));

  })
  .catch(err => res.status(400).render('signup', {
    errorMessage: err.errmsg
  })); 

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
  });
});

//CONFIRMATION

router.get("/confirm/:confirmCode", (req, res) => {
User.find({confirmationCode: req.params.confirmCode})
.then(data => {
  console.log(data)
  User.updateOne({_id : data[0]._id}, {status: 'Active'})
  .then(data => {
    res.render('auth/confirmation')
  })
  .catch(err => res.status(400))
})
.catch(err => res.status(400))
})


module.exports = router;

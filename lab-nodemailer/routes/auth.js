const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt-nodejs");
const bcryptSalt = 10;

//Transporteur qui envoie le mail
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAILUSER,
    pass: process.env.GMAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: false
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
  const confirmationCode = getConfirmationCode();
    if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  function getConfirmationCode() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }
    return token;
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
      confirmationCode,
    });


    
    newUser.save()
    .then(() => {
      //res.redirect("/");
      let email = req.body.email;
      console.log('email', email)
      transporter.sendMail({
        from: 'appli web',
        to: email, 
        subject: "code de confirmation", 
        text: "http://localhost:3000/auth/confirm/${confirmationCode}",
        html: "http://localhost:3000/auth/confirm/${confirmationCode}",
      })
      .then(info => {
        //res.render("/", { message: "Vérifie tes mails" })
        res.send('ok sendmail')
      })
      .catch(error => {
        console.log(error)
        res.send('er sendmail')
      })
    })
    .catch(err => {
      res.send('er save')
      //res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:id', (req, res, next) => {
  let id = req.params.id
  User.findByIdAndUpdate(id, { status: "Active" })
    .then(user => {
      res.render('confirmed-email', { user: user })
    })
    .catch(err => { console.log(err), res.render('confirmed-failed') })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;

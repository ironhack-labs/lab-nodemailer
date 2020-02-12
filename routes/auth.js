const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../configs/nodemailer.config')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// GEnerates The confirmationConde for each new User
const confCodeGenerate = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
}


//Send the confirmation link  to every new User email

const sendConfEmail = (email, confirmationCode) => {

  mailer.sendMail({
    from: '"Ironhacker Email 👻" <myawesome@project.com>',
    to: email,
    text: "Prueba",
    html: `<b><a href='http://localhost:3000/auth/confirm/${confirmationCode}'>Click to confirm</a></b>`
  })
    .then(console.log("Se manda correo", email))
    .catch(err => console.log(err))

}



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
  console.log(confCodeGenerate())
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {


  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  let confirmationCode = confCodeGenerate()

  if (username === "" || password === "" || email === "") {
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
      confirmationCode,
    });

    newUser.save()
      .then(newUser => {
        sendConfEmail(newUser.email, newUser.confirmationCode)
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


router.get('/confirm/:confirmationCode', (req, res, next) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmationCode }, { status: "Active" })
    .then(() => res.render('auth/confirmation', { message: "Congratulation, your account is active" }))
    .catch(err => res.render('auth/confirmation', { message: "ha habido un error con tu cuenta, contacta a nuestros agentes" }))
})

router.get('/profile', (req, res, next) => {
  console.log(req.user)
  res.render('profile', req.user)
})



module.exports = router;

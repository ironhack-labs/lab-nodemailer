const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const layout = '<b>Please confirm your email</b><br><a href="http://localhost:3000/auth/confirmationURL">Click here for confirmation</a>';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

const sendConfirmationEmail = user => {
  return new Promise((resolve, reject) => {
    let messageHTML = layout.replace('confirmationURL', encodeURIComponent(user.confirmationCode));
    console.log(`Sending this html: ${messageHTML}`);
    transporter.sendMail({
      from: `"Nodemailer Project " <ironhacker33@gmail.com>`,
      to: user.email,
      subject: 'NodeMailer',
      text: `Hola ${user.username} nodeMailer requiere tu confirmacion`,
      html: messageHTML
    })
  })
}

const processSignupPost = (req, res, next) => {

  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const hashConfCode = bcrypt.hashSync(username, salt);

      //check for scape character

      const newUser = new User({
        username,
        password: hashPass,
        email,
        confirmationCode: hashConfCode
      });
      //checking-> no need to insert status.

      return newUser.save()
    })
    .then(user => {
      console.log('usuario creado')
      console.log(user);
      sendConfirmationEmail(user)
        .then(info => {
          console.log('mensaje enviado');
          app.locals.message = 'mensaje enviado';
          res.redirect('/');
        })
        .catch(err =>
          console.log('problema con el mensaje'));
      console.log(e)
    })
    .catch((err) => {
      res.render("auth/signup", { message: "Something went wrong" });
    });
}

const processConfCode = (req, res) => {
  const confCode = decodeURIComponent(req.params.confCode);
  console.log(`Confirmation code received: ${req.params.confCode}`);
  console.log((`Confirmation code received: ${confCode}`));
  User.findOneAndUpdate(
    { confirmationCode: confCode },
    { 'status': 'Active' })
    .then(user => {
      console.log(`User has confirmed his email! ${User}`);
      res.redirect('/');
    })
    .catch(e => console.log(`Rare confirmation Code recieved 
  ${e}`));
}


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", processSignupPost);

authRoutes.get("/:confCode", processConfCode);

module.exports = authRoutes;

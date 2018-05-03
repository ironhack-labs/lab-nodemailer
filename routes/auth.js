const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

// let { email, subject, message } = req.body;
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jpinzunzaa@gmail.com',
    pass: 'coolman1'
  }
});

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


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

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  //const rol = req.body.role;
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
    const confirmationCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: confirmationCode
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
        let message = {
          from: '"lab-nodemailer" <johnny.phocker@gmail.com>',
          to: email, 
          subject: 'Confirme su cuenta', 
          text: 'Gracias por crear su usuario con nosotros',
          html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">¡Confirma ya!</a>`
        }
        transporter.sendMail(message);

      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:confirmationCode", (req, res, next) => {

  User.findOneAndUpdate({confirmationCode: req.params.confirmationCode},{$set:{status:'Active'}})
  .then(() => res.redirect('/profile')).catch(e => console.log(e));
  
  res.render("auth/confirm");
});

// authRoutes.get("/confirm", (req, res, next) => {
//   res.render("auth/confirm");
// });


module.exports = authRoutes;

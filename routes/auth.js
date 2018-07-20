const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
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
  const email    = req.body.email;

  const rol = req.body.role;
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
    const hashConfirmationCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirmationCode
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'rickirea@gmail.com',
            pass: 'G00gl3G00gl3' 
          }
        });

        transporter.sendMail({
          from: '"My Awesome Project 👻" <rickirea@gamil.com>',
          to: 'rickirea@gmail.com', 
          subject: 'Please confirm your signup', 
          text: 'Hi ' + username + ', Please confirm your signup',
          html: '<b><a href="http://localhost:3000/auth/confirm/'+hashConfirmationCode+'">Clicka aqui para confirmar</></b>'
        })
        .then(info => console.log(info))
        .catch(error => console.log(error))

        res.redirect("/");
      }
    });
  });
});

authRoutes.get('/confirm/:confirmCode', (req,res, next) =>{
  console.log("Entrando en confirmacion");
  const confirmCode = req.params.confirmCode;
  //console.log(confirmCode);

  User.findOne({ "confirmationCode": confirmCode }, (err, user) => {
    if (err || !user) 
    {
      console.log("The username doesn't exist");
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    else
    {
      User.update({_id: user._id}, { $set: {status: 'Active'}})
      .then((response) => {
        console.log({response});
        res.render('auth/confirmation',{user});
      })
      .catch((error) => {
        console.log(error)
      });
    }
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendTemplate = require('../helpers/mailer').sendTemplate;

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
    const hashUser = bcrypt.hashSync(username, salt);
    const confirmationArr = hashUser.split('/');
    const confirmationCode = confirmationArr.join('');

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });


    newUser.save((err) => {
      sendTemplate(newUser)
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/auth/login");
      }
     })
      .catch(e=>next(e));

    });
  });

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get('/confirmation', (req,res) => {
  res.render('/auth/confirmation')
})

authRoutes.get("/confirm/:confirmationCode", (req, res, next) => {
  const confirmationCode = req.params.confirmationCode;
  User.findOneAndUpdate({confirmationCode: confirmationCode}, {$set:{status:"Active"}}, {new:true})
  .then(update=>{
    // res.redirect('/auth/confirmation');
    res.send('You have been confirmed')
  })
  .catch(e=>(e))
  
});

module.exports = authRoutes;

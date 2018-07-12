const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const {sendMail}  = require("../mail/sendMail");


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
  const {username, password, email} = req.body;
  const rol = req.body.role;
  if (username === "" || password === ""  || email === "") {
    res.render("auth/signup", { message: "Username, password and email must all be filled in" });
    return;
  }


  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = encodeURIComponent(bcrypt.hashSync(username, salt));
    // const hashCode = code.replace('/',''); 

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        sendMail(newUser);
        res.redirect("/");
      }
    });
  });

});


authRoutes.get('/confirm', (req,res,next) => {
  let confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({confirmationCode: confirmCode}, {status: "Active"})
  .then(user => {
    res.render('auth/login', user);
  })
  .catch( (err) => {
    console.log(err);
  })
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

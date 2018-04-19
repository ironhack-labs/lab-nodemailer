const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendAwesomeMail = require('../mail/sendMail')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/confirmation", (req, res, next) => {
  res.render("auth/confirmation", { "message": req.flash("error") });
});

authRoutes.get("/profile", (req, res, next) => {
  res.render("auth/profile", { "message": req.flash("error") });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "profile",
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
    const hashUser = encodeURIComponent(bcrypt.hashSync(username, salt));
    const hashUserTrue = hashUser.replace(/[/.$%]/g, "")
    console.log(hashUserTrue)
    const newUser = new User({
      username,
      password: hashPass,
      email,
      status:"Pending Confirmation",
      confirmationCode: hashUserTrue,

    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
      sendAwesomeMail(newUser.email, newUser.confirmationCode)
      .then(() => {
        req.flash('info', 'MENSAJE ENVIADO');
        res.redirect('/')
      })
      .catch(error => {
        req.flash('info', 'ERROR, NO SE HA PODIDO ENVIAR EL MENSAJE');
        next(error)
      })  
    });
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res) => {
console.log(req.params.confirmCode)

User.findOneAndUpdate({"confirmationCode": req.params.confirmCode}, {status:'Active'})
    .then(() => {
      res.redirect("/auth/confirmation");
  // .then(()=>
  // res.redirect("confirmation"))
  //res.redirect("");
})})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

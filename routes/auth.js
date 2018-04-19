const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendAwesomeMail = require('../mail/sendMail');

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
    let hashPassCode = bcrypt.hashSync(username, salt);

    hashPassCode = hashPassCode.replace(/\//g,'');

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashPassCode
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
      sendAwesomeMail(newUser.email,newUser.confirmationCode,{mail_title:"Codigo de Avtivación"})
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

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  
  let code = req.params.confirmCode;

  User.findOneAndUpdate({ 'confirmationCode':code },{ 'status': "Active" }).then( user => {

      if (user === null) {
        res.redirect("/auth/signup");
      } else {
        res.render("auth/confirmation", user)
      }
    }
  );
 });



authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


authRoutes.get("/:id/profile", (req, res, next) => {
  
  let id = req.params.id;

  User.findById(id).then( user => {
      if (user === null) {
        res.redirect("/auth/signup");
      } else {
        console.log(user)
        res.render(`auth/profile`, user)
      }
    }
  );
 });


module.exports = authRoutes;

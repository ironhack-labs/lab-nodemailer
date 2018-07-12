const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const transport = require("../mailing/transport");
const template = require("../mailing/template")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username, password and email"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashCode = encodeURI(bcrypt.hashSync(username, salt)).replace("/", "");

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashCode,
      email
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        transport
          .sendMail({
            to: email,
            subject: "subject",
            text: "Hola",
            // html: ` <b>http://localhost:3000/auth/confirm/${hashCode}</b>`
            html: template(username, `http://localhost:3000/auth/confirm/${hashCode}`)
          })
          .then(() => console.log("Send email"))
          .catch(error => console.log(error));

        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get(
  "/confirm/:confirmationCode",
  (req, res) => {
    
    User.findOne({confirmationCode:req.params.confirmationCode}).then(user => {
      User.findByIdAndUpdate(user.id,{status : "Active"}).then(() => {
        res.render("auth/confirm", { user });
      })
      
    }, console.log("Error"));
  }
);

authRoutes.get("/profile/:username",(req, res) => {
    User.findOne({username:req.params.username}).then(user => {
      res.render("auth/profile", { user });
    }, console.log("Error"));
  }
);

module.exports = authRoutes;

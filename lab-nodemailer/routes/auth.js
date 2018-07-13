const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const transporter = require("../mailer/transporter");

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

// authRoutes.get("/profile", (req,res, next)=>{
//   res.render("profile");
// });


authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const rol = req.body.role;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashUser = encodeURI(bcrypt.hashSync(username, salt)).replace("/", "");

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUser
    });

    transporter.sendMail({
      to: email,
      subject: "hola co",
      text: "Bienvenido",
      html: `http://localhost:3000/auth/confirm/${hashUser}`
    })
      .then(() => console.log("Ha llegado"))
      .catch(error => console.log(error));



    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/confirm/:confirmationCode", (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmationCode }).then(user => {
    User.findByIdAndUpdate(user.id, { status: "Active" }).then(() => {
      res.render("confirm", { user });
    })

  }, console.log("Error"));
}
);



authRoutes.get("/profile/:username", (req, res) => {
  User.findOne({ username: req.params.username }).then(user => {
    res.render("profile", { user });
  }, console.log("Error"));
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

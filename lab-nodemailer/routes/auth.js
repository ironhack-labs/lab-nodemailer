const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

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
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const conf = bcrypt.hashSync(username, salt);

    const newUser = new User({
      email,
      username,
      password: hashPass,
      confirmationCode: conf
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        const encode = encodeURIComponent(conf);
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'pepe04444@gmail.com',
            pass: 'm20684-m20684'
          }
        });
        transporter.sendMail({
          from: '"Pepote" pepe04444@gmail.com',
          to: email, 
          subject: "Email confirmation", 
          text: `Confirma tu email - http://localhost:3000/confirm/${encode}`,
          html: `<b>Confirma tu email - http://localhost:3000/confirm/${encode}</b>`
        })
        .then(info => {
          console.log(info)
          res.redirect("/");
        })
        .catch(error => console.log(error));
        
      }
    });
  });


});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  const confirmationCode = decodeURIComponent(req.params.confirmCode);
  User.findOneAndUpdate({ confirmationCode }, { status:"Active" }, {new:true})
  .then( user => {
      res.render("confirmation", { user });
  })
  .catch(err => console.log(err))
});


authRoutes.get("/profile", (req, res) => {
  res.render("profile");
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

  
  
const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const authRoutes = express.Router();
const User = require("../models/User");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
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

// authRoutes.post("/confirm", (req, res, next) => {
//   const {username, email, password, confirmationCode} = req.body;
//   if (username === "" || password === "") {
//     res.render("auth/signup", { message: "Indicate username and password" });
//     return;
//   }

//   User.findOne({ username }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("auth/signup", { message: "The username already exists" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);
//     const hashName = bcrypt.hashSync(username, salt);

//     const newUser = new User({
//       username: username,
//       email: email,
//       password: hashPass,
//       confirmationCode: hashName
//     });

//     const saveUser = newUser.save();
    
//     const sendMail = transport.sendMail({
//       from: "Pope Francis <pope@vatican.com>",
//       to: email,
//       subject: "You're signed up!",
//       text: `Welcome, 
//             ${username}, you are now signed up :)
//             Click on this link http://localhost:3000/auth/confirm/${confirmationCode} to confirm.
//             `,
//       html: `
//         <h1>Welcome</h1>
//         <p>Welcome, ${username}, you are now signed up :)
//          Click on this <a href="http://localhost:3000/auth/confirm/${confirmationCode}">link</a> to confirm.
//         </p>
//       `
//     });
//     Promise.all([ saveUser, sendMail ])
//       .then(() => {
//         res.redirect('/');
//       })
//       .catch((err) => {
//         next(err);
//       });
//   });
// });


authRoutes.post("/confirm", (req, res, next) => {
  const {username, email, password, confirmationCode} = req.body;
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
    const hashName = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      confirmationCode: hashName
    });

    newUser.save()
      .then(() => {
        return transport.sendMail({
          from: "Pope Francis <pope@vatican.com>",
          to: email,
          subject: "You're signed up!",
          text: `Welcome, 
                ${username}, you are now signed up :)
                Click on this link http://localhost:3000/auth/confirm/${confirmationCode} to confirm.
                `,
          html: `
            <h1>Welcome</h1>
            <p>Welcome, ${username}, you are now signed up :)
             Click on this <a href="http://localhost:3000/auth/confirm/${confirmationCode}">link</a> to confirm.
            </p>
          `
        })
      })
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        next(err);
        console.log(err);
      })
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const transporter = require('../configs/transporter');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

    // detect if username or email already exists
  User.findOne({ $or: [{username},{email}] }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username or the email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
    }

      //Saving the user with all given information
    const newUser = new User({
      username,
      password: hashPass,
      email, // same as: email:email
      confirmationCode:token
    });

    let message = `
    Hello ${username}. 
    To confirm your email, please go to this link: ${process.env.BASE_URL}/auth/confirm/${token}
    `
    
    newUser.save()
    .then(() => {
      transporter.sendMail({
        from: '"Charlotte" <charlotte.treuse7fff00@gmail.com>',
        to: email, 
        subject: 'Validate your account', 
        text: message,
        html: `<b>${message}</b>`
      })
      .then(() => {
        res.redirect("/auth/signup-done");
      })
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});


router.get("/signup-done", (req, res, next) => {
  res.render("auth/signup-done");
});


router.get("/confirm/:confirmationCode", (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmationCode }, //getting a certain info from the URL
    { status: 'Active'}
    ) 
    .then(user => {
      if (user) {
        // to log in the user found in the database:
        req.logIn(user, () => {
        res.render("auth/confirmation-success", {user,
        isConnectedAndActive: true //to override a value defined by a previous middleware
          })
        })
      }
      else res.render("auth/confirmation-failed");
    })
  .catch(err => next(err))
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;

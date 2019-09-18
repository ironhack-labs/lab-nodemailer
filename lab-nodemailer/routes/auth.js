const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const mail = process.env.MAILUSER;
const passUser = process.env.PASSUSER;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mail,
    pass: passUser
  }
});



router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
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
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });

    newUser.save()
      .then(() => {
        transporter.sendMail({
            "from": "My website",
            "to": email,
            "subject": "Please activate your account",
            "html": `Para activar tu cuenta haz click <a href=http://localhost:3000/auth/confirm/${token}>aqui</a>`
          })
          .then(() => {
            res.redirect("/auth/confirmation");
          })
          .catch( () => {
            res.redirect("/auth/confirmation-bad");
          })
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:token", (req, res) => {
  const token = req.params.token
  User.findOne({
      confirmationCode: token
    })
    .then(activeUser => {
      User.updateOne(activeUser, {
          status: 'Active'
        }, {
          new: true
        })
        .then(() => {
          res.redirect("/auth/confirmation");
        })
        .catch( () => {
          res.redirect("/auth/confirmation-bad");
        })
    })

})

router.get("/confirmation", (req, res) => {
  res.render("auth/confirmation", {user: req.user})
})

router.get("/confirmation-bad", (req, res) => {
  res.render("auth/confirmation-bad", {user: req.user})
})

router.get("/profile", (req, res) => {
  res.render("auth/profile", {user: req.user})
})

module.exports = router;
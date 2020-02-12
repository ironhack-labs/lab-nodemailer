const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../configs/nodemailer.config')

const subject = 'Has creado una nueva cuenta'

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  const confirmationCode = req.body.confirmationCode;

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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }


    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });


    console.log("---------", newUser)

    mailer.sendMail({
      from: '"Ironhacker email" <email@email.com>',
      to: email,
      subject: subject,
      text: `Accede a este link para confirmar la cuenta <a href="http://localhost:3000/auth/confirm/${token}">link</a>`,
      html: `Accede a este link para confirmar la cuenta <a href="http://localhost:3000/auth/confirm/${token}">link</a>`,
    })

    newUser.save()
      .then(user => {
        console.log("despues del save", user)
        res.redirect("/");
      })
      .catch(err => {
        console.log(err)
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


router.get("/confirm/:confirmationCode", (req, res) => {
  const confirmation = req.params.confirmationCode

  User.findOneAndUpdate({
      "confirmationCode": confirmation
    }, {
      "status": "active"
    }, {
      new: true
    })
    .then((user) => {
      if (user === null) {

        res.render("auth/confirmation", {
          message: "Todo MAAAAAL"

        })
      } else {
        res.render("auth/confirmation", {
          message: "Todo correcto "
        })
      }
    })
    .catch(err => console.log(err))

})



module.exports = router;
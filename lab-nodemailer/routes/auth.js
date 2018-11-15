const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function codeGen() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.password;
  const status = "Pending Confirmation";
  const confirmationCode = codeGen();
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

    const newUser = new User({
      username,
      password: hashPass,
      email,
      status,
      confirmationCode
    });

    newUser
      .save()
      .then(() => {
        //send email
        let message = `http://localhost:3000/auth/confirm/${newUser.confirmationCode}`;
        let subject = "Confirm your signup";
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "sarahchamorro02@gmail.com",
            pass: "Mechakucha1!"
          }
        });
        transporter
          .sendMail({
            from: '"Ironhack Confirmation Email 👻" <myawesome@project.com>',
            to: newUser.email,
            subject: subject,
            text: message,
            html: `<b><a>${message}</a></b>`
          })
          .then(info =>
            res.render("message", { email, subject, message, info })
          )
          .catch(error => console.log(error));
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/auth/confirm/:confirmationCode", (req, res, next) => {
  res.render("confirm");
});

/*
router.post('/signup/auth', (req, res, next) => {
  let message = `http://localhost:3000/auth/confirm/${confirmationCode}`;
  let subject = 'Confirm your signup';
  const email = req.body.password;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sarahchamorro02@gmail.com',
      pass: 'Mechakucha1!'
    }
  });
  transporter.sendMail({
    from: '"Ironhack Confirmation Email 👻" <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
});
*/

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

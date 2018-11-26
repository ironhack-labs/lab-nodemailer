const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const mail = require("../mail/transporter");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

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

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: token
    });

    newUser
      .save()
      .then(() => {
        mail
          .sendMail({
            from: '"My A" <myawesome@project.com>',
            to: "smvironhack@gmail.com",
            subject: "Prueba Steven",
            text: "Prueba Steven",
            html: `<b>http://localhost:3000/auth/confirm/${token}</b>`
          })
          .then(res.redirect("/"))
          .catch(error => console.log(error));
      })
      .catch(err => {
        res.render("auth/signup", { message: err });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



router.get("/confirm/:confirmCode", (req, res, next) => {
  code = req.params.confirmCode;

  console.log(code);
 
  User.findOneAndUpdate({confirmationCode:code}, { $set: {status:'Active'} }, { new: true }).then(user=>{
      res.render("confirmation.hbs",{user});
  })
  
});

router.get('/profile',(req,res,next)=>{
  res.render('auth/profile');
})

router.get(
  "/check-profile",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;

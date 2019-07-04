const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
      confirmationCode: token
    });

    newUser
      .save()
      .then(() => {
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });

        // console.log ("DEBUG Auth", {
        //   user: process.env.GMAIL_USER,
        //   pass: process.env.GMAIL_PASS 
        // })
      
        transporter
          .sendMail({
            from: '"Ingo & Sonia " <myawesome@project.com>',
            to: newUser.email,
            subject: "Confirmation from LAB-NODEMAILER",
            text: `Click on the following link nice looking person http://localhost:3001/auth/confirm/${newUser.confirmationCode}`,
            html: `<b>${"Click on the following link nice looking person http://localhost:3001/auth/confirm/"+newUser.confirmationCode+""}</b>`
          })
          
      })
      // .catch(error => console.log(error))
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


router.get("/confirm/:confirmationCode",(req,res,next)=>{
  let confFromEmail = req.params.confirmationCode;
  console.log(req.params.confirmationCode);
  User.findOneAndUpdate({confirmationCode: confFromEmail}, {
    status: "Active"
  }).then((user) => {
    req.login(user, () => {
      // console.log("logged in")
      res.redirect("/your-account-is-validated")
    })
  })
})


module.exports = router;

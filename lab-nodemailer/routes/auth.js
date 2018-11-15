const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "sarahchamorro02@gmail.com",
    pass: "Mechakucha1!"
  }
});

function codeGen() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const confirmationCode = '123';


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
        transporter.sendMail({
          from: "Miguel - Tarea que hice solo :(",
          to: newUser.email,
          subject: "Confirmar cuenta",
          html: 
  `<html>
  <head></head>
  <body style="background-color: #2B2F30">
    <div style="font-family: 'Helvetica Neue', Helvetica;    text-align: center;    padding: 5px; ;"><img src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4017/s300/logo-ironhack-blue.png" alt="Ironhack" style="padding-top: 15px;"/>
      <p></p>
      <div style="width: 80%;      max-width: 800px;      font-weight: 300;      margin: 0 auto;      background-color: white;      border-radius: 15px;      padding: 15px;      padding-bottom: 15px;">
        <h1 style="font-size:24px; font-weight: 100;">Let's get started with this test, ${newUser.username}</h1>
        <p style="font-size:18px; line-height: 1.5;">Confirm your email now to activate your account. If you've forgotten your password or username, you can create a new account or access Mongo and delete it yourself, lol.</p><a href="http://localhost:3000/auth/confirm/${newUser.confirmationCode}" style="padding: 15px;        font-family: 'Helvetica Neue', Helvetica;        text-size: 18px;        color: white;        background-color: #52C3FB;        border: 0;        border-radius: 5px;        margin: 10px;        display: block;        max-width: 200px;        margin: auto;        text-decoration: none;">Confirm email address</a>
        <h2 style="  font-weight: 200;        color: #52C3FB;">Lorem Ipsum</h2>
        <p font-size:16px; style="line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum id nunc quis tempor. Duis sed libero ornare felis bibendum dapibus. Suspendisse condimentum varius felis a rutrum. Aliquam posuere feugiat arcu, non gravida ipsum lacinia sit amet. Morbi euismod nisi a enim placerat, non venenatis diam pretium.</p>
      </div>
    </div>
    <div style=" margin: 0 auto;    padding: 20px;    display: block;    width: 200px;    text-align: center;"><img src="https://lomotif-prod.s3.amazonaws.com/stickers/Email/Facebook.png" alt="Facebook"/><img src="https://lomotif-prod.s3.amazonaws.com/stickers/Email/Twitter.png" alt="Twitter"/><img src="https://lomotif-prod.s3.amazonaws.com/stickers/Email/IG.png" alt="Instagram"/></div>
  </body>
  </html>`
  
        });
  
  res.redirect(`/`);
      })
      .catch(err => {
        res.render("auth/signup", { message: err });
      });
  });
});

router.get("auth/confirm/:confirmationCode", (req, res, next) => {
  let confirmCode =  confirmationCode;
  User.findOneAndUpdate(confirmCode, {"status": "Active"})
  .then(user => 
    res.render("auth/confirm", {user}))
  .catch(err => console.log(err))
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

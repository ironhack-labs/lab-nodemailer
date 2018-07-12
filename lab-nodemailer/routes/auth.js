const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
require('dotenv').config();

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

  
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const rol = req.body.role;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Fields cannot be empty!" });
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
    const validatedHash = hashName.replace("/", "-");

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: validatedHash,
      role:"teacher"
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });

    //send email

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS 
      }
    });
    console.log(process.env.GMAIL_USER);
    console.log(process.env.GMAIL_USER);
    let link = `http://localhost:3000/auth/confirm/${validatedHash}`
    let message = `Confirm your account here ${link}`;
    let htmlEmail = `<div style="width:800px;background-color:#ededed;font-family:sans-serif;text-align:center;font-size:40px;font-weight: 700"><p style="margin:20px 0;padding-top:20px;">Ironhack-lab-Nodemailer</p><div style="padding:0 30px;margin:0 auto; width:650px; background-color: #fff;font-size:20px; font-weight: 400"><img src="http://www.fundacionuniversia.net/wp-content/uploads/2017/09/ironhack_logo.jpg" width=200 style="margin:10px 0"><h2>IronHack Confirmation Email</h2><h3>Hello ${username}!</h3><p style="font-size: 16px">Thanks for joining our comunity! Please confirm your account clicking on the following link: ${link}</p><p></p><h3>Great to see you creating awesome webpages with us</h3><h4>You are doing awesome!</h4></div></div>`

    transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email, 
      subject: 'Awesome Subject', 
      html: `<b>${htmlEmail}</b>`
    })
    .then(info => {
      console.log(info);
      res.render('message', {email, subject, message, info})
    })
    .catch(error => console.log(error))
  });
});

authRoutes.get('/confirm/:confirmCode', (req,res,next) => {
  let confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({confirmationCode: confirmCode}, {status: "Active"})
  .then((user) => {
    console.log({user})
    res.render('auth/confirmation', {user});
  })
  .catch( (err) => {
    console.log(err);
  })
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

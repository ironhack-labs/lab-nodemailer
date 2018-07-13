const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer= require("nodemailer");
const urlencode=require("urlencode")

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
  const email= req.body.emilio;
  //const rol = req.body.role;
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
    const hassUser= bcrypt.hashSync(username,salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hassUser,
      //role:"teacher"
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.render("checked");
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS 
          }
        });
        
        let urlEnco=urlencode(hassUser)
        transporter.sendMail({
          from: process.env.USER_EMAIL,
          to: email, 
          subject: 'lolito', 
          html: `<b><a href="http://localhost:3000/auth/confirm/${urlEnco}">CACA</a></b>`
        })
        .then(info => {console.log(info) }) 
        .catch(error => console.log(error))
      }



    });
  });
});

authRoutes.get(`auth/confirm/:id`,(req,res,next)=>{
   res.redirect("/")
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

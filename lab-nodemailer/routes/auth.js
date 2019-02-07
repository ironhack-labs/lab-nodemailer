require('dotenv').config();

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

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


  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmation = req.body.confirmation
for (let i = 0; i < 25; i++) {
  confirmation += characters[Math.floor(Math.random() * characters.length )];
}

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
      email: email,
      confirmationcode: confirmation
    });

    newUser.save()
    .then(() => {

      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: `${process.env.USER}´,
          pass: `${process.env.PASS}´
        }
      });
      console.log(confirmation + " Hola")
      var objectMail = {
        from: '"My Awesome Project " <myawesome@project.com>',
        to: email, 
        subject: 'IronHack', 
        text: 'Veasdfnga que funciona',
        html: `<a href=http://localhost:2000/auth/confirm/${confirmation}>Link</a>`
      }
      transporter.sendMail(objectMail)



      .then(info => console.log(info))
      .catch(error => console.log(error))
       res.redirect("/");
    })
    .catch(err => {
      console.log(err)
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:code",(req,res,next)=>{

  const code = req.params.code 
 
  User.find({confirmationcode: code})
  .then((data)=>{


if(data[0].status != "Active"){

    User.findOneAndUpdate(data,{status: "Active"})
    .then((data)=>{

      res.render("auth/profile",{data})
    })

} else {
  res.redirect("/")
}


  })

})









router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../configs/nodemailer.config')


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
  
  const {username, password, email} = req.body


  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username,password an email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = {
      username,
      password: hashPass,
      confirmationCode: Math.random()*100,
      email
    };

  console.log(newUser)
    

    User.create(newUser)
    .catch(err => console.log(err))
    // res.render("auth/signup", { message: "Something went wrong" })

    mailer.sendMail({
      from: '"Lab Nodemailer" <myawesome@project.com>',
      to: email,
      subject: "Prueba google no me banees estoy estudiando porfa" ,
      text:`Hola amigo, metete aqui -> http://localhost:3000/auth/confirm/${newUser.confirmationCode}`,
      html: `<b>Hola amigo</b>, metete aqui -> http://localhost:3000/auth/confirm/${newUser.confirmationCode}`
    })
      .then(res.redirect('/auth/login'))
      .catch(err => console.log(err))
  })
})

router.get('/confirm/:cC',(req,res)=>{
  if(req.params.cC === req.user.confirmationCode){
    req.user.status = "Active"
    User.findByIdAndUpdate(req.user._id,req.user)
      .then(x => res.render('confirmation'))
      .catch(err => console.log(err))
  }
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

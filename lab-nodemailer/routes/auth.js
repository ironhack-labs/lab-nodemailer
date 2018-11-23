const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const transporter=require()


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

router.post('/send-email', (req, res, next) => {
  const {username,password,email,code} = req.body;
  
    // .then(() => res.render('message', {username,password,email, confirmationCode}))
    // .catch(err => console.log(err));
})
 

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email=req.body.email;
  const codeconfirm= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += codeconfirm[Math.floor(Math.random() * codeconfirm.length )]};

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
      email,
      confirmationCode:token,      
      username,
      password: hashPass,
    
    });

    newUser.save()
    .then(() => {
      transporter.sendMail({
    
        from: 'Miguel <migueliron166@gmail.com>',
        to: email,
        subject: 'Confirmation message',
        username:username,
        text: 'Confirmation message',
        password:password,
        code:token,
        html: '<a href="http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER">confirm<a>'},
      res.redirect("/")
    )
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});
});
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

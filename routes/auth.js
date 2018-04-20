const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const authRoutes = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
  }
})

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
  const status = req.body.status;
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
    const hashCode = bcrypt.hashSync(username, salt);


      
    User.create({username, password: hashPass, email, confirmationCode: hashCode, status})
    .then((user)=>{
      transport.sendMail({
        from: "Your website",
        to: user.email,
        subject: "It's Britney, bi*ch!",
        text: `http://localhost:3000/auth/confirm/${encodeURIComponent(user.confirmationCode)}`,
        html: `http://localhost:3000/auth/confirm/${encodeURIComponent(user.confirmationCode)}`
      })
      .then(()=>{
        res.redirect('/');
      })
      .catch((err)=>{
        next(err);
      })
    })
    .catch((err)=>{
      next(err);
    });
    
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get('/confirm/:confirmationCode', (req, res, next)=>{
const {confirmationCode} = req.params;

  User.findOneAndUpdate({confirmationCode},
  {status: "Active"})
  .then((userDetails)=>{
    res.locals.theUser = userDetails;
    res.render('auth/confirmation');
  })
  .catch((err)=>{
    next(err);
  })
});

authRoutes.get('/profile-view/:profileId', (req, res, next)=>{
  User.findById(req.params.profileId)
  .then((userDetails)=>{
    res.locals.theUser = userDetails;
    res.render('auth/profile');
  })
  .catch((err)=>{
    next(err);
  })

})

module.exports = authRoutes;

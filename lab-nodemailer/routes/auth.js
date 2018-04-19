const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendAwesonmeMail = require("../mail/sendMail")


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/profile",(req,res,next)=>{
  res.render("auth/profile",{user:req.user})  
})

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmationCode = req.body.confirmationCode;
  const email = req.body.email;
  if (username === "" || password === "" || confirmationCode === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashPass,
      email,

    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      
      }
    }).then(() => {
      const encoded = encodeURIComponent(hashPass);
        sendAwesonmeMail(email, `<a href="http://localhost:3000/auth/confirm/${encoded}">Signup</a>`)
          .then(() => res.redirect("/"))
          .catch(err => next(err));
    })
  });
});

authRoutes.get("/confirm/:confirmationCode", (req, res) => {
  let confirm = req.params.confirmationCode
console.log(req.params.confirmationCode)
  User.findOneAndUpdate({"confirmationCode": confirm}, {status:"Active"}).then((user) => {
console.log(user)
    res.render("auth/confirmation", {user});
  })


  
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail= require("../mail/sendMail")

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
  if (username === "" || password === "" || email=== "") {
    res.render("auth/signup", { message: "Missing some values" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = encodeURI(bcrypt.hashSync(username, salt)).replace("/", "");

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashPass,
      status:"Pending confirmation"
    });

    newUser.save()
    .then(()=>{
      sendMail(email,"confirmación de cuenta",`http://localhost:3000/auth/confirm/${hashPass}`)
    })
    .then(() => {
      res.redirect(`/auth/profile/${newUser._id}`);
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmationCode",(req,res,next)=>{
  User.findOneAndUpdate({confirmationCode:req.params.confirmationCode},{status:"Active"}).then((user)=>{
    res.render("auth/confirm",{user})
  })
  .catch(e=>next(e))
  })

  router.get("/profile/:id",(req,res,next)=>{
    User.findById({_id:req.params.id}).then((user)=>{
      console.log(user)
      res.render("auth/profile",{user});
    })
    .catch(e=>next(e))
  })




module.exports = router;

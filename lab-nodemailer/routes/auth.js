const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {confirmAccount}=require('../config/nodemailer')


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email=req.body.email;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 6; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
  const confirmationCode=token;


  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  await User.findOne({ username }, "username", (err, user) => {
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
      confirmationCode

    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })


  });

  await confirmAccount(
    email,
    `http://localhost:3000/auth/confirm/${confirmationCode}`
  )

  res.render('auth/signup',{msng:'User registered'})

});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



router.get('/confirm/:codeRecive',async(req,res,next)=>{
console.log(req.params)
const {codeRecive}=req.params;

await User.findOneAndUpdate({confirmationCode:codeRecive},{status:'active'},{new:true}).then((x)=>{
res.redirect('/auth/login')

})
.catch((err)=>{
console.log(err)
})
} )





module.exports = router;

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const crypto = require('crypto');
const confirmationCode = crypto.randomBytes(20).toString('hex');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const usersMiddlewares = require('../middlewares/users.mid');

const tmpConfirmationMail = require('../templates/confirmation.mail');
const transporter = require('../configs/nodemailer.config');

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}), (req, res) => {

  let url = ``; 
  url = (req.user.username && req.user.status === 'Active') ? 
  `/${req.user.username}` :
  `/${req.user.username}/status`;

  res.redirect(url);

});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    return res.render("auth/signup", { message: "Indicate username, password and email" });
   
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      return res.render("auth/signup", { message: "The username already exists" });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      confirmationCode,
      password: hashPass
    });

    newUser.save()
    .then(() => {

      transporter.sendMail({
        from: '"appMailer" <antonio.ironhack@gmail.com>',
        to: email, 
        subject: "Confirmation mail", 
        text: "Confirm",
        html: tmpConfirmationMail(confirmationCode, username)
      })
      .then(info => console.log(info))
      .catch(error => console.log(error));


      res.redirect("/");
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


router.get("/confirm/:confirmCode", (req, res) => {
  User.findOneAndUpdate({confirmationCode:req.params.confirmCode},{$set:{status: 'Active'}},{new: true})
  .then((user)=> res.render("auth/activation",{user}))
  .catch((err)=> next(err))  
})


module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("../helpers/passport");
const bcrypt = require("bcrypt");
const sendWelcomeMail = require("../helpers/mailer").sendWelcomeMail;

router.get("/confirm/:confirmCode", (req, res) => {
  const code = req.params.confirmationCode;
  User.findOneAndUpdate(code, { status: "ACTIVE" }, { new: true }).then(() => {
    res.send("Tu cuenta está activa");
    //res.redirect('auth/site');
  });
});

// router.get('/profile/:email', (req, res) =>{
//   res.render('auth/profile')
// user.find
//})

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const hash = bcrypt
    .hashSync(req.body.email, bcrypt.genSaltSync(10))
    .split("/");
  req.body.confirmationCode = hash;

  User.register(req.body, req.body.password)
    .then(user => {
      // console.log(user)
      sendWelcomeMail(user);
      res.redirect("/login");
    })
    .catch(e => next(e));
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.post("/login", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => res.redirect("/"))
    .catch(e => next(e));
});

module.exports = router;

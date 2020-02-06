const express = require("express");
const passport = require('../config/passport');
const router = express.Router();
const User = require("../models/User");
const {signupView, signup, loginView, logout} = require('../controller')


router.get("/login", loginView);

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", signupView)

router.post("/signup", signup)

router.get('/logout', logout)

module.exports = router;

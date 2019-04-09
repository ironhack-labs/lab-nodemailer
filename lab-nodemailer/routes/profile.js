const express = require('express');
const router  = express.Router();
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");

/* GET home page */
// router.get("/", passport.authenticate("local", {
//   successRedirect: "/profile/home",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

router.get("/", ensureLogin.ensureLoggedIn(), (req, res) => { 
  res.render("profile/home", { user: req.user });
});

module.exports = router;


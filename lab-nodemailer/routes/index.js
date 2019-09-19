const express = require('express');
const router  = express.Router();
const passport = require ("passport")
const loginMid = require ("./../middlewares/login.mid")

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.flash("error"))
  res.render("index", { message: req.flash("error") });
});

router.post("/", [
  loginMid.loginWithPendingAccount,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
]);

module.exports = router;

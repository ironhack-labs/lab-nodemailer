const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const { postSignup, getConfirm } = require("../controllers/authControllers");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", postSignup);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//incpompleta
router.get("/confirm/:confirmCode", getConfirm);

module.exports = router;

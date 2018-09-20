const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../mail/transport');
var urlencode = require('urlencode');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get("/profile/:id", (req, res) => {
  let id = req.params.id;
  console.log(id)
  User.findById(id)
  .then ((e) => {
    console.log(e)
    res.render("profile", {e})
  })
  .catch(e => console.log(e))
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;

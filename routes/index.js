const express = require('express');
const User = require("../models/User");
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/profile", (req, res) => {
  user = (req.session.passport.user)
  
  if (!user) {
    res.redirect("/auth/login")
  }

  User.findById(user).then(user => {
    res.render("profile", {user});
  })
});

module.exports = router;

const express = require('express');
const { ensureLoggedIn } = require('../middleware/ensureLogin')
const router  = express.Router();
const User = require("../models/User");



router.get("/privatePage", ensureLoggedIn("/auth/login"), (req, res) => {
  User.find({})
  res.render("privatePage", { user: req.user });
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

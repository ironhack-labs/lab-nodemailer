const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/profile", (req, res, next) => {
    User.findById(req.user._id)
    .then(user => {
      return res.render('profile', { user });
    });
});

module.exports = router;

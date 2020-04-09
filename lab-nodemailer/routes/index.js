const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    res.render('profile', { user });
  })
  .catch(err => console.log(err));
});

module.exports = router;

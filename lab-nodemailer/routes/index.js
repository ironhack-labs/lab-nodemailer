const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.user)
  const { _id } = req.user
  res.render('index', { _id });
});

router.get('/profile/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    res.render('profile', { user });
  })
  .catch(err => console.log(err));
});

module.exports = router;

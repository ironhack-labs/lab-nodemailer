const express = require('express');
const router = express.Router();
const User = require('../models/User')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', (req, res) => {
  User.findById(req.user._id)
    .then(user => {
      if (user)
        res.render('profile', { user })
      else
        res.render("auth/login", { errorMessage: "No estás logueado" })
    })
    .catch(err => res.render("auth/login", { errorMessage: "Something went wrong with the login" }))

})

module.exports = router;

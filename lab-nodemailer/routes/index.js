const express = require('express');
const router  = express.Router();
const { checkLogin } = require("../middlewares")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', checkLogin, (req, res, next) => {
  console.log("Debug User" , req.user)
  res.render('profile', {user: req.user});
});

router.get('/your-account-is-validated', checkLogin, (req, res, next) => {
  console.log("Debug User" , req.user)
  res.render('auth/confirmation', {user: req.user});
});


module.exports = router;




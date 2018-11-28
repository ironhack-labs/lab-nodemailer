const express = require('express');
const router  = express.Router();
const {isLoggedIn} = require('../middlewares/isLogged');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/profile", isLoggedIn('/auth/login'), (req, res, next) => {
  res.render("profile");
});


module.exports = router;

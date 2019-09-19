const express = require('express');
const router  = express.Router();


const check = require('../middlewares/activeMid')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/message", (req, res, next) => {
  const message = req.user.email
  res.render("message");
});

router.get("/profile", check.checkActive, (req, res, next) => {
  const user = req.user
  res.render("profile", {user});
});

module.exports = router;

const express = require('express');
const router  = express.Router();
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
// const check = require('../middlewares/activeMid')

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


// router.use('/auth', authRoutes);
// router.use('/profile', profileRoutes)

module.exports = router;

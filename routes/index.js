const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/profile", (req, res, next) => {
  if(req.user) {
    const {username, status} = req.user;
    res.render("profile", {username, status});
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;

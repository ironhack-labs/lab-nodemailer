const express = require("express");
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", ensureAuthenticated, (req, res, next) => {
  res.render("profile", { user: req.user });
});

module.exports = router;

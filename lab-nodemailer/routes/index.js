const express = require("express");
const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
};

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isAuth, (req, res) => {
  let { status, username } = req.user;
  user = { status, username };
  console.log(user);
  res.render("profile", user);
});

module.exports = router;

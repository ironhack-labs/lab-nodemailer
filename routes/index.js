const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", (req, res, next) => {
  console.log("DEBUG req.user", req.user);
  const { username, status } = req.user;
  res.render("profile", { username, status });
});

module.exports = router;

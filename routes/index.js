const express = require("express");
const { isConnected } = require("../middlewares");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isConnected, (req, res, next) => {
  let user = req.user;
  res.render("profile", { user });
});

module.exports = router;

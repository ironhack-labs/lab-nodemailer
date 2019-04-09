const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let { username, status } = req.user;
  res.render("private/profile", { username, status });
});
module.exports = router;
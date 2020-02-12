const express = require("express");
const router = express.Router();
const User = require("../models/User");
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/user/:id", (req, res, next) => {
  let { id } = req.params;
  User.findById(id).then(userFound => {
    console.log(userFound) 
    return res.render("auth/profile", {userFound})});
});
module.exports = router;

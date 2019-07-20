const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/auth");

/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index");
});

router.get("/profile", isAuth, (req, res) => {
    console.log(req.user);
    res.render("profile", { user: req.user });
});

module.exports = router;
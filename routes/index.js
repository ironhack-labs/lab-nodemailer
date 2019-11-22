const express = require('express');
const router  = express.Router();

const {
  signupGet,
  signupPost,
  isNotLoggedIn,
  loginGet,
  profileGet,
  isLoggedIn
 
} = require("../controllers/auth.controller");

const {
  editStatus,
} = require("../controllers/index.controller");

const passport = require("../config/passport");

// SIGNUP
router.get("/signup", signupGet);
router.post("/signup", signupPost);

//confirm email
router.get("/confirm/:token", editStatus);
router.post("/profile", editStatus)

//login
router.get("/login", isNotLoggedIn, loginGet);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/signup");
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
    });
  })(req, res, next);
});

router.get("/profile", isLoggedIn, profileGet);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router; 

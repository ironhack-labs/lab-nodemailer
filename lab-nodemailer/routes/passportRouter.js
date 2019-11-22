const passportRouter = require("express").Router();
const passport = require("../config/passport");

//Controllers
const {
    signupGet,
    signupPost,
    loginGet,
    confirmAccount
  } = require('../controllers/auth.controllers')

//middleware
const {catchErrors} =
require('../middleware/catchErrors');

//Assign routes
// SIGNUP
passportRouter.get("/signup", signupGet);
passportRouter.post("/signup", signupPost);

// LOGIN
passportRouter.get("/login", isNotLoggedIn, loginGet);

function isNotLoggedIn (req, res, next) {
  !req.isAuthenticated() ? next() : res.redirect("/private-page");
};

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}))


passportRouter.get("/passport/confirm/:confirmationCode", confirmAccount)

passportRouter.get("/profile-page", ensureLogin, (req, res) => {
  res.render("passport/private", { user: req.user });
});

function ensureLogin(req, res, next) {
  console.log(req.isAuthenticated())
  return req.isAuthenticated() ? next() : res.redirect("/login")
}

// Logout Route
passportRouter.get("/logout", (req, res, next)=>{
  req.logout();
  res.redirect("/login")
})

module.exports = passportRouter;
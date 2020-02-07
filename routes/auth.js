const router = require('express').Router();
const { catchErrors } = require('../middlewares/catcherrors')
const {isLoggedIn, isActive } = require('../middlewares/auth')
const passport = require('../config/passport')
const {signupPost,signupGet,confirmGet,confirmPageGet,
  profileGet,
  loginGet,loginPost
} = require('../controllers/index')



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.get("/signup", signupGet)
router.post("/signup",signupPost)
router.get("/login",loginGet)
router.post("/login", passport.authenticate('local', {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
}))
router.get("/confirm/:confirmationCode",catchErrors(confirmGet))
router.get("/confirmation",confirmPageGet)
router.get("/profile",profileGet)

module.exports = router;

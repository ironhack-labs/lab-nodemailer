const router = require('express').Router();
const { catchErrors } = require('../middlewares/catcherrors')
const {isLoggedIn, isActive } = require('../middlewares/auth')
const {signupPost,signupGet,confirmGet,confirmPageGet,
  //profileGet,profilePost,
  loginGet,loginPost
} = require('../controllers/index')



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.get("/signup", signupGet)
router.post("/signup",signupPost)
router.get("/login",loginGet)
//router.post("/login",loginPost)
router.get("/confirm/:confirmationCode",catchErrors(confirmGet))
router.get("/confirmation",confirmPageGet)
//router.post("/profile",profilePost)

module.exports = router;

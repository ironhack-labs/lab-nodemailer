const router = require('express').Router();
const passport = require('./../config/passport');
const {
  getLoginForm,
  getSignupForm,
  createUser,
  getUserProfile,
  verifyAccount,
  resetVerifyCode,
  loginUser
} = require('./../controllers');
const { catchErrors, isLoggedIn } = require('./../middleware');

/* GET home page */
router.get('/', isLoggedIn, (req, res, next) => {
  res.redirect(`user/${req.use.id}`);
});

router.get('/login', getLoginForm);
router.post('/login', passport.authenticate('local'), loginUser);

router.get('/signup', getSignupForm);
router.post('/signup', catchErrors(createUser));

router.get('/user/', isLoggedIn, catchErrors(getUserProfile));
router.get('/user/verify/:code', isLoggedIn, catchErrors(verifyAccount));
router.get('/user/reset-code', isLoggedIn, catchErrors(resetVerifyCode));

module.exports = router;

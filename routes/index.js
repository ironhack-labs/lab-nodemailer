const express = require('express');
const sessionMiddleware = require('../middlewares/session.middleware');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/home', sessionMiddleware.isAuthenticated, (req, res, next) => {
  res.render('home', {user: res.locals.currentUser});
});

module.exports = router;

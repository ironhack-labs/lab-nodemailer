const express = require('express');
const router  = express.Router();
const { isActiveAndConnected } = require('../middlewares');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// profile page - protected
router.get('/profile', isActiveAndConnected, (req,res,next) => {
  let user = req.user
  res.render('profile', {user})
})


module.exports = router;

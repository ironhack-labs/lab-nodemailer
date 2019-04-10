const express = require('express');
const router  = express.Router();
const checkConnectedAndActive = require('../configurations/middlewares').checkConnectedAndActive;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', checkConnectedAndActive, (req,res,next)=> {
  let user = req.user
  res.render('profile', {
    user
  })
})

module.exports = router;
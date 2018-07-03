const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {req});
});

router.get('/profile/:id', (req, res, next) => {
  User.findOne({_id: req.params.id})
    .then(user => {
      res.render('profile', {user});
      console.log(user);
    })
    .catch(err => {
      console.log('Profile unwanted to be shown: ', err);
      next();
    });
})

module.exports = router;

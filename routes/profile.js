const express = require("express");
const router = express.Router();
const User = require("../models/User");

const usersMiddlewares = require('../middlewares/users.mid');

router.all('/:user*', usersMiddlewares.isUser);




router.get('/:user', (req, res) => {
  // console.log(res.locals.userProfile[0]);
  if(res.locals.userProfile[0].status === 'Pending Confirmation') {
    res.status(404);
    return res.render('not-found');
  }

  let yourProfile = (req.user.username === res.locals.userProfile[0].username) ? true : false;
  

  res.render('profile/profile', {yourProfile, logged: req.user, profile: res.locals.userProfile[0]});
});

router.get('/:user/status', (req, res) => {
  res.json({status: res.locals.userProfile[0].status});
});



module.exports = router;
const express = require('express');
const router  = express.Router();
const User = require("../models/User");


router.get('/profile/:id', (req, res, next) => {
  let id = req.query.id
  User.findById(id)
  .then(user=>{
    res.render('profile',{user})
  })
  .catch(e=>next(e))
})

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

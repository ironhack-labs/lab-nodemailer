const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
router.get('/activate/:confirmationCode', (req, res, next) => {
  
  User.find({confirmationCode: req.params.confirmationCode}).then(user => {
    return User.findByIdAndUpdate( user[0]._id, {status: 'Active'})
  }).then(updated => res.json(updated))
  
});

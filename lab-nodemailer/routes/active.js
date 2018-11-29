const express = require('express');
const router = express.Router();
const User = require("../models/User");

router.get('/:code', (req, res, next) => {
  const token = req.params.code

  User.findOne({
      confirmationCode: token
    })
    .then(user => {
      console.log('TE ENCONTRE')
      id = user._id
      console.log(id)
      User.findByIdAndUpdate(id,{status : "Active"})
        .then(u => {
          console.log(u)
          console.log('User active')
          res.render('auth/active');
        })

    })
    .catch(e => {
      console.log('fuck')
      console.log(e)
    })
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require("../models/User")

router.get('/:id', (req, res, next) => {

  console.log(req.params.id)

  User.findOneAndUpdate({ confirmationCode: req.params.id }, { status: 'Active' })


    // User.findOne({ confirmationCode: req.params.id })

    .then(whatYouFound => {
      if (whatYouFound) {
        console.log("You found something!", whatYouFound)
        whatYouFound.status = "Active"
        res.redirect("/")
        return
      }
      console.log("MEEEH", whatYouFound)
      res.redirect("/")


    })
    .catch(err => {
      console.log(err)
    })

});



module.exports = router;

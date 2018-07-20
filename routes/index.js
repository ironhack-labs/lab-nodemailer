const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/profile/:userid",(req, res, next) =>{
  const userid = req.params.userid;

  User.findOne({ "_id": userid }, (err, user) => {
    if (err || !user) 
    {
      console.log("The username doesn't exist");
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    else
    {
      res.render("profile", {user});
    }
  });
})

module.exports = router;

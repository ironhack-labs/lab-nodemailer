const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/auth/sigup',(req, res, next) => {
  res.render('signup');
});

router.get("/profile/:userid", (req, res, next) => {
  const userid = req.params.userid;
User.findOne({"_id": userid}, (error,user) => {
  if(error || !user){
    console.log("El usuario no existe");
    res.render('auth/login', {
      errorMessage: "El usuario no existe"
    })
    return;
  }
  else{
    res.render('profile', {user});
  }
});
})
module.exports = router;

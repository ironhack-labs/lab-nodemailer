const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  
  res.render('index');
});

router.get('/profile/:username', (req,res)=>{
User.findOne({username:req.params.username}).then((user)=>{
  res.render('profile',{user})
})
.catch(err=>console.log(err))
 
})

module.exports = router;

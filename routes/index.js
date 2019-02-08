const express = require('express');
const router  = express.Router();
const {checkConnectedAndActive} = require('../configs/middlewares')
//same as: const checkConnectedAndActive = require('../configs/middlewares').checkConnectedAndActive

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', checkConnectedAndActive, (req,res,next)=> {
  let user = req.user // When connected to database, req.user is a document with the information of the logged in user
  res.render('profile', {
    user
  })
})


module.exports = router;

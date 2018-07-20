const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/auth/sigup',(req, res, next) => {
  res.render('signup');
})
module.exports = router;

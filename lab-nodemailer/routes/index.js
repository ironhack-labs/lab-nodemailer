const express = require('express');
const router  = express.Router();
const check = require('../middleware/isactivemid')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/', check.checkActive, (req, res, next) => {
  const logged= req.user;
  res.render('private', {logged});
});



module.exports = router;

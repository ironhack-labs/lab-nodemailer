const express = require('express');
const router  = express.Router();
const {verify} = require('../controller')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/confirm/:code', verify)

module.exports = router;

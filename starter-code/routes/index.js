const express = require('express');
const router  = express.Router();
const sendMail = require("../email/sendMail")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});



module.exports = router;

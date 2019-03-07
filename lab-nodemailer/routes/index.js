const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/send-email', (req, res, next) => {
  let { username, password, email, confirmationCode} = req.body;
  res.render('message', { username, password, email, confirmationCode })
});



module.exports = router;

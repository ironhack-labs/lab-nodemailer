const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/send-email', (req, res, next) => {
  let { email, username } = req.body;
  res.render('message', { email, username })
});

module.exports = router;

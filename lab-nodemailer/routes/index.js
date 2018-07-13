const express = require('express');
const router  = express.Router();


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/auth/signup', (req, res, next) => {
  res.render('/auth/signup');
});

router.post('send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message })
});

module.exports = router;

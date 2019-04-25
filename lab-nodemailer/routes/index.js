const express = require('express');
const router  = express.Router();
const { sendConfirmation } = require('../handlers/nodemailer')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const { email } = req.body
  sendConfirmationCode()
  res.send('Listo, se envió')
})

module.exports = router;

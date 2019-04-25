const express = require('express');
const router  = express.Router();
const {sendConfMail} = require('../handlers/nodemailer')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const {email, quote} = req.body
  sendConfMail(email, quote)
  .then(() =>console.log('Hola'))
  .catch(err => console.log(err))
  //res.send('Enviado')
})
module.exports = router;

module.exports = router;

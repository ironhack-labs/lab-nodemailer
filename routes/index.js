const router = require('express').Router()
const { sendMail } = require('../handlers/nodemailer')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.post('/', (req, res, next) => {
  const { email } = req.body
  sendMail(email)
    .then(() => res.send('Listo, se envió'))
    .catch(err => res.send('Hubó un error', e))
})

module.exports = router

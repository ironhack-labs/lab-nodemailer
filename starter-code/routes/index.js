const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message })
});

// router.post('/send-email', (req, res, next) => {
//   console.log("Mandando email...")
//   let { username, password, status, confirmationCode, email } = req.body;
//   console.log(req.body)
//   sendMail(destino, { mensaje }).then(() => {
//     res.render({ username, password, status, confirmationCode, email })
//   })
// });

module.exports = router;



const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const UserModel = require('../models/User.js');


/* GET home page */
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/auth/signup', (req, res) => {
  const { email, username, password } = req.body;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i += 1) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
  }

  const newUser = new UserModel({
    email,
    username,
    password,
    confirmationCode
  });

  newUser.save()
    .then(() => {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'abarbierijunior@gmail.com',
          pass: 'KALUZINHA2332'
        }
      });
      transporter.sendMail({
        from: '"Confirmation E-mail',
        to: email,
        subject: 'Confirmation E-mail',
        text: 'Confirm your e-mail, please!',
        html: `<b><a href=http://localhost:3000/auth/confirm/${confirmationCode} + >Click here to confirm your email</a></b>`
      });
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
    });
});


router.get('/auth/confirm/:confirmationCode', (req, res) => {

  const { confirmationCode } = req.params;


  UserModel.findOne({ confirmationCode })
    .then((user) => {
      console.log(user);
      if (user !== null) {
        UserModel.updateOne({ confirmationCode }, { status: 'Active' })
          .then(() => {
            console.log('Status of account: Active');
            res.send('E-mail confirmed; Status of account: Active');
          });
        return;
      }
      console.log('code not ok');
      res.render('/');
    });
});

module.exports = router;

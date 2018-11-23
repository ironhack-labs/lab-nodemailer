const express = require('express');
const passport = require('passport');
require('dotenv').config();

const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

// Bcrypt to encrypt passwords
const bcryptSalt = 10;


router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;
  const confirmationCode = token;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
    });


    newUser.save()
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
  transporter.sendMail({
    from: '"Theo Calderon Wants You to Confirm" <myawesome@project.com>',
    to: email,
    subject: 'Email Confirmation',
    text: 'Go to this link to confirm',
    html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a{padding:0;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}.ExternalClass *{line-height:100%;}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table, td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}img{border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}p{display:block;margin:13px 0;}</style><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px;}@viewport{width:320px;}}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]> <style type="text/css"> .outlook-group-fix{width:100% !important;}</style><![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important; max-width: 100%;}.mj-column-per-50{width:50% !important; max-width: 50%;}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width: 100% !important;}td.full-width-mobile{width: auto !important;}}</style></head><body style="background-color:#F4F4F4;"><div style="background-color:#F4F4F4;"><div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:30px;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:214px;"><img height="auto" src="https://66.media.tumblr.com/89d6b16f135762ff9b05114b25b19b01/tumblr_pilyguU4TY1u4bxgt_540.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="214"></td></tr></tbody></table></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:15px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#55575d;"><p style="text-align: center; margin: 10px 0;color:#151e23;font-size:14px;font-family:Georgia,Helvetica,Arial,sans-serif">Product | Concept | Contact</p></div></td></tr></table></div></td></tr></tbody></table></div><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:600px;"><img height="auto" src="https://66.media.tumblr.com/14c54be0fd3a15c16e38529ea12d2af5/tumblr_p4kuccgK1w1vp5j01o1_1280.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="600"></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div><div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:30px;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:10px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:30px;line-height:22px;text-align:left;color:#55575d;"><p style="line-height: 30px; margin: 10px 0; text-align: center; color:#151e23; font-size:30p; font-family:Georgia,Helvetica,Arial,sans-serif">- Meet My Dog -</p></div></td></tr></table></div></td></tr></tbody></table></div><div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;vertical-align:top;"><div class="mj-column-per-50 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:30px;padding-bottom:20px;padding-left:30px;word-break:break-word;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:240px;"><img height="auto" src="https://66.media.tumblr.com/0364b0d40bbf93055b56f4950b4d0d5b/tumblr_oubdacQ7z41vp5j01o1_1280.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="240"></td></tr></tbody></table></td></tr></table></div><div class="mj-column-per-50 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:40px;padding-bottom:0px;padding-left:40px;word-break:break-word;"><div style="font-family:Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#55575d;"><p style="margin: 10px 0; color:#151e23; font-size:16px; font-family:Georgia,Helvetica,Arial,sans-serif"><b>Theo || Theo Calderon</b></p><p style="line-height: 16px; margin: 10px 0;font-size:14px; color:#151e23; font-family:Georgia,Helvetica,Arial,sans-serif; color:#354552">I like to piss Everywhere and sniff some Ass. Get at me!</p><p style="line-height: 16px; margin: 10px 0; color:#354552; font-size:14px; font-family:Georgia,Helvetica,Arial,sans-serif"><a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirm The Email</a></p></div></td></tr></table></div></td></tr></tbody></table></div><div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:rtl;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;vertical-align:top;"><div class="mj-column-per-50 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"></table></div><div class="mj-column-per-50 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3b5998;border-radius:3px;width:20px;"><tr><td style="font-size:0;height:20px;vertical-align:middle;width:20px;"><a href="https://www.facebook.com/sharer/sharer.php?u=[[SHORT_PERMALINK]]" target="_blank"><img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;" width="20"></a></td></tr></table></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#bd081c;border-radius:3px;width:20px;"><tr><td style="font-size:0;height:20px;vertical-align:middle;width:20px;"><a href="https://pinterest.com/pin/create/button/?url=[[SHORT_PERMALINK]]&media=&description=" target="_blank"><img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/pinterest.png" style="border-radius:3px;" width="20"></a></td></tr></table></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"><tr><td style="padding:4px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3f729b;border-radius:3px;width:20px;"><tr><td style="font-size:0;height:20px;vertical-align:middle;width:20px;"><a href="[[SHORT_PERMALINK]]" target="_blank"><img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png" style="border-radius:3px;" width="20"></a></td></tr></table></td></tr></table></td></tr></table></div></td></tr></tbody></table></div></div></body></html>`,
  })
    .then(info => console.log(`${info}YOU SENT AN EMAIL`))
    .catch(error => console.log(error));
});

router.get('/confirm/:confirmCode', (req, res) => {
  const  { confirmCode } = req.params;
  console.log(confirmCode);
  User.findOneAndUpdate({ confirmationCode: confirmCode }, { status : 'Active' }, { new: true }).then((user) => {
    console.log(user);
    res.redirect('https://youtu.be/HAc3T4aMENI');
  }).catch((err) => {
    console.log(err);
  });
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

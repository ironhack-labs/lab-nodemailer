const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

const firstEmailSnippet = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>
      
    </title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
  <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Lato:300,400,500,700);
    </style>
  <!--<![endif]-->


    
<style type="text/css">
  @media only screen and (min-width:480px) {
    .mj-column-per-66 { width:66% !important; max-width: 66%; }
.mj-column-per-100 { width:100% !important; max-width: 100%; }
  }
</style>


    <style type="text/css">
    
    

@media only screen and (max-width:480px) {
  table.full-width-mobile { width: 100% !important; }
  td.full-width-mobile { width: auto !important; }
}

    </style>
    
    
  </head>
  <body style="background-color:#e0f2ff;">
    
    
  <div
     style="background-color:#e0f2ff;"
  >
    
  
  <!--[if mso | IE]>
  <table
     align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  >
    <tr>
      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]-->

  
  <div  style="background:#2a5cab;background-color:#2a5cab;margin:0px auto;max-width:600px;">
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#2a5cab;background-color:#2a5cab;width:100%;"
    >
      <tbody>
        <tr>
          <td
             style="direction:ltr;font-size:0px;padding:10px 0;text-align:center;"
          >
            <!--[if mso | IE]>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            
    <tr>
  
        <td
           class="" style="vertical-align:top;width:396px;"
        >
      <![endif]-->
        
  <div
     class="mj-column-per-66 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  >
    
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
  >
    <tbody>
      <tr>
        <td  style="vertical-align:top;padding:0px;">
          
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
  >
    
        <tr>
          <td
             align="center" style="font-size:0px;padding:18px 0px;word-break:break-word;"
          >
            
  <div
     style="font-family:Lato, Helvetica, Arial, sans-serif;font-size:20px;line-height:1;text-align:center;color:#ffffff;"
  >OttoCodeBerlin</div>

          </td>
        </tr>
      
  </table>

        </td>
      </tr>
    </tbody>
  </table>

  </div>

      <!--[if mso | IE]>
        </td>
      
    </tr>
  
              </table>
            <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    
  </div>

  
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  
  <table
     align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
  >
    <tr>
      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]-->

  
  <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
    >
      <tbody>
        <tr>
          <td
             style="direction:ltr;font-size:0px;padding:0px;padding-top:20px;text-align:center;"
          >
            <!--[if mso | IE]>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            
    <tr>
  
        <td
           class="" style="vertical-align:top;width:600px;"
        >
      <![endif]-->
        
  <div
     class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
  >
    
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
  >
    <tbody>
      <tr>
        <td  style="vertical-align:top;padding:0px;">
          
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
  >
    
        <tr>
          <td
             align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
          >
            
  <table
     border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
  >
    <tbody>
      <tr>
        <td  style="width:192px;">
          
  <img
     alt="tickets" height="auto" src="https://i2.wp.com/www.slyced.de/wp-content/uploads/2016/08/universe-1044107_1280.jpg?w=1136&ssl=1" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="192"
  />

        </td>
      </tr>
    </tbody>
  </table>

          </td>
        </tr>
      
        <tr>
          <td
             align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
          >
            
  <div
     style="font-family:Lato, Helvetica, Arial, sans-serif;font-size:20px;line-height:1;text-align:center;color:black;"
  ><strong>Hey `

const secondEmailSnippet = `
<br />
<br />
Please confirm your account by clicking the link below:
        <br />
<br />`

const thirdEmailSnippet = ` <br />
<br />

</strong></div>

  </td>
</tr>

</table>

</td>
</tr>
</tbody>
</table>

</div>

<!--[if mso | IE]>
</td>

</tr>

      </table>
    <![endif]-->
  </td>
</tr>
</tbody>
</table>

</div>


<!--[if mso | IE]>
</td>
</tr>
</table>

<table
align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
>
<tr>
<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
<![endif]-->


<div  style="background:#2a5cab;background-color:#2a5cab;margin:0px auto;max-width:600px;">

<table
align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#2a5cab;background-color:#2a5cab;width:100%;"
>
<tbody>
<tr>
  <td
     style="direction:ltr;font-size:0px;padding:10px;text-align:center;"
  >
    <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
    
<tr>

<td
   class="" style="vertical-align:top;width:580px;"
>
<![endif]-->

<div
class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
>

<table
border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
>
<tbody>
<tr>
<td  style="vertical-align:top;padding:0px;">
  
<table
border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
>

<tr>
  <td
     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
  >
    
<div
style="font-family:Lato, Helvetica, Arial, sans-serif;font-size:20px;line-height:1;text-align:center;color:white;"
>Best, <br /><br /> The OttoCodeBerlin Team</div>

  </td>
</tr>

</table>

</td>
</tr>
</tbody>
</table>

</div>

<!--[if mso | IE]>
</td>

</tr>

      </table>
    <![endif]-->
  </td>
</tr>
</tbody>
</table>

</div>


<!--[if mso | IE]>
</td>
</tr>
</table>
<![endif]-->


</div>

</body>
</html>`

//
router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') })
})

//
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

//
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

//
router.post('/signup', (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' })
      return
    }

    //Create Confirmation Code
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let token = ''
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)]
    }
    const confirmationCode = token

    //Hash password
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      email,
      confirmationCode,
      password: hashPass
    })

    newUser
      .save()
      .then(data => {
        transporter.sendMail({
          from: '"OttoCodeBerlin Projects" <projects@ottocodeberlin.com>',
          to: data.email,
          subject: 'Confirm Your Account at OttoCodeBerlin',
          html:
            firstEmailSnippet +
            data.username +
            secondEmailSnippet +
            'http://localhost:3000/auth/confirm/' +
            data.confirmationCode +
            thirdEmailSnippet

          // text:
          //   'Hello' +
          //   data.username +
          //   '! Please click here to confirm:' +
          //   'http://localhost:3000/auth/confirm/' +
          //   data.confirmationCode +
          //   '  . Thank you.'
          //html: `<b>${'Hello'}</b>`
        })
      })
      .then(info => res.render('auth/email-sent', { email }))
      .catch(err => {
        res.render('auth/signup', { message: 'Something went wrong' })
      })
  })
})

//
router.get('/confirm/:confirmCode', (req, res) => {
  User.find({ confirmationCode: req.params.confirmCode }).then(user => {
    let id = user[0]._id

    User.findByIdAndUpdate(id, { status: 'Active' }, function(err, result) {
      if (err) {
        console.log(err)
      }
      let userEmail = user[0].email
      let userId = user[0]._id
      res.render('auth/confirmation', { userEmail, userId })
    })
  })
})

//
router.get('/profile/:id', (req, res) => {
  User.find({ _id: req.params.id })
    .then(user => {
      let username = user[0].username
      let email = user[0].email
      let status = user[0].status
      res.render('auth/profile', { username, email, status })
    })
    .catch(error => {
      console.log('Error occured:', error)
    })
})

//
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

module.exports = router

router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project " <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    html:  `<a href="http://localhost:3000/auth/confirm/${confirmationCode}"><h1>Click here to confirm your account</h1></a>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
});
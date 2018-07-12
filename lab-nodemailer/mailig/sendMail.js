transporter.sendMail({
    to: 'pepe04444@gmail.com', 
    subject: 'Awesome Subject', 
    text: 'Awesome Message',
    html: '<b>Awesome Message</b>'
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))


module.exports = {
  templateExample: (message) => { return `PASTE THE HTML CODE HERE AND USE THE ${message} VARIABLE WHERE YOU WANT` }
}


router.post('/send-email', (req, res, next) => {
  //....
    transporter.sendMail({
      from: '"My Awesome Project 👻" <myawesome@project.com>',
      to: email, 
      subject: subject, 
      text: message,
      html: templates.templateExample(message),
    })
  //....
  });
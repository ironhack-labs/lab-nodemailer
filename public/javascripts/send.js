const transporter =  require('./transport')

exports.sendMail = (email, subject ,message) => transporter.sendMail({
  from:  '<lab@project.com>',
  to: email, 
  subject: subject, 
  html: `Confirmation code <b>${message}</b>, <a href="http://localhost:3000/auth/confirm/${message}">click</a>`
}).then(info => {return info.accepted})


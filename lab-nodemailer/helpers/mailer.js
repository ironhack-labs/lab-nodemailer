let nodemailer =   require('nodemailer')


let transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS
  }
})


exports.sendActivationMail = function(name, email, confirmationCode){
  transport.sendMail({
    from:'Ironhack Support 🎢 <support@ih.com>',
    bcc: email,
    subject: 'Welcome ' + name,
    html: `<h3>Hi there, ${name} </h3>
           <p>Thank you for creating an account, please click the confirmation link below:</p>
           <a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirmation link</a>
    
    `
  })
  .then(r=>console.log(r))
  .catch(e=>console.log(e))
}

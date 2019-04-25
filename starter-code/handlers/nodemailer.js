const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "SendGrid", 
  auth: {
    email: process.env.NMUSER,
    pass: process.env.NMPASS
  }
})

exports.sendConfMail= (email, token) => {
  transporter
  .sendMail({
    from: '"Ironhack" <ironhackers@ironhack.com>',
    to: email,
    subject: "You're almost an ironhacker, confirm your account!",
    html: `
    <h1>Hey, there!</h1>
    <p>You're almost an ironhacker, you just have to click <a href="http://localhost:3000/auth/confirm/${token}">here</a> 
    to confirm your email and then be part of our community!</p>`
  })
  .then(response => console.log(response))
  .catch(err => console.log(err))
}
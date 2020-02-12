//NodeMailer setup
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service : 'Gmail',
  auth:{  
    user:'conejitomalo198@gmail.com',
    pass: 'popino198'
  }
})

module.exports = transporter
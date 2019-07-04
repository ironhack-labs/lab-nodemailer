require('dotenv').config()
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth:{
    user: process.env.SGUSER, 
    pass: process.env.SGPASS
  } 
})

module.exports = transporter
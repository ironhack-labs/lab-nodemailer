const nodemailer= require ('nodemailer')
require ('dotenv').config();






let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:AdminPassword,
    pass: process.env.Admin
  }
});
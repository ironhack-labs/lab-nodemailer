const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mohsan.ironhack@gmail.com',
      pass: 'jkjjlkjlk' 
    }
});

module.exports = transporter;
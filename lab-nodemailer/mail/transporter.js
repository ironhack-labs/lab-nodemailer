const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pepe.ironhack@gmail.com',
      pass: 'pepe1234Ironhack' 
    }
});




module.exports = transporter;

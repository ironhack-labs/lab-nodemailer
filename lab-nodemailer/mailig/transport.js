const env = require('dotenv');
env.config();
env.config({path: '../.env.private'});

let transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.PASSWORD
    }
  });

  module.exports = transport;
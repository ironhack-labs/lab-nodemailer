const nodemailer = require('nodemailer');

const {GMAIL_USER, GMAIL_PASSWORD} = process.env;
console.log(`Mail transport: ${GMAIL_USER}`);
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD
    }
});

module.exports = { transport };
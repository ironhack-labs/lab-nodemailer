require('dotenv').config({path: '.env'});
const nodemailer= require ('nodemailer');

let transporter = nodemailer.createTransport ({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendMail = (to, subject, message) => {
    console.log(to, subject, message)
    return transporter.sendMail ({
        to,
        subject,
        html: `<b>${message}</b>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
}

module.exports = sendMail;

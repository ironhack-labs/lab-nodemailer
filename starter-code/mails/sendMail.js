require('dotenv').config({ path: '.private.env' });
const nodemailer = require('nodemailer');

if (!process.env.GMAIL_USER || !process.env.GMAIL_PW) {
    throw new Error('CONFIGURE THE ENV VARIABLES IN THE .PRIVATE.ENV FILE.')
}

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PW
    }
})

const sendEmail = (to, sub, mes) => {
    return transporter.sendMail({
        to,
        sub,
        html: `<a href='${mes}'>Ricardo Christian</a>`
    })
        .then(info => console.log(info)
            .catch(err => console.log(err)
            )
        )
}

module.exports = sendEmail;
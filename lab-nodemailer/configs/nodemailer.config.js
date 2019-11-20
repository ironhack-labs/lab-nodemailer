const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ironger3@gmail.com',
        pass: `${process.env.PASSWORD}`
    }
})

module.exports = transporter
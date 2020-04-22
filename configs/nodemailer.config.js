const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testfordev2@gmail.com',
        pass: 'Testfordev2*2'
    }
})

module.exports = transporter
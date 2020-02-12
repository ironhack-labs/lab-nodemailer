const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ironhacker1020@gmail.com',
        pass: 'germantastico'
    }
})

module.exports = transporter
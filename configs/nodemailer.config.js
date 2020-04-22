const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'shumoreniko86@gmail.com',
        pass: 'C@vallo94'
    }
})

module.exports = transporter
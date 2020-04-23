const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'amurawczik@gmail.com',
        pass: 'Amurawczik182'
    }
})
module.exports = transporter
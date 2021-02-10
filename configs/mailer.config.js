const nodemailer = require('nodemailer')
const { generateTemplate }= require('./mail.template')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
})

module.exports.sendActivationEmail = (email, token) => {
    transporter.sendMail({
        from: `'Kuku' <${process.env.NM_USER}>`,
        to: email,
        subject: '🌳 Activate account',
        html: generateTemplate(token)
    })
}
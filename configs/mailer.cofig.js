const nodemailer = require('nodemailer')
const {generateTemplate} = require ('./mailtemplate')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
})

module.exports.sendActivationEmail = (email, code) => {
	transporter.sendMail({
		from: `"Ironhack, Lab-Nodemailer" <${process.env.NM_USER}>`,
		to: email,
		subject: "Thanks for joining us!",
        html: generateTemplate(code)
	})
}
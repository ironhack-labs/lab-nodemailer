require('dotenv').config()
const nodemailer = require('nodemailer')

const user = process.env.EMAIL
const password = process.env.PASSWORD

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: user,
      pass: password 
    }
})

module.exports.sendEmail = (name, email, token) => {
	transporter.sendMail({
		from: `Miguel Valle :) ${user}`,
		to: `${email}`, 
		subject: 'Please confirm your account',
		html: `
		<a href=http://localhost:3000/confirm/${token}> Please click the link to confirm your account </a>
		`
	})
}
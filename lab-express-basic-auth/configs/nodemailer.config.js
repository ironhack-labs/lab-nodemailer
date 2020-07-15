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
		<div style='text-align:center'>
		<h1>Ironhack Confirmation Email!</h1>
		<h2>Hello ${name}</h2>
		<p> Thanks to join our community! Please confirm your account clicking on the following link:</p>
		<a href=http://localhost:3000/confirm/${token}> Please click the link to confirm your account </a>
		<h3>Great to see you reating aresome webpages you with us!😎</h3>
		</div>
		`
	})
}
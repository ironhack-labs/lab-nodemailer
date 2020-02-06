const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	host: 'lpapel.com',
	port: 26,
	secure: false,
	auth: {
	user: process.env.SENDGRID_USERNAME,
	pass: process.env.SENDGRID_PASSWORD
	}
})


exports.confirmAccount = async (email, code, endpoint) => {
	return await transporter.sendMail({
	from: 'HOLA! <no-reply@labmailer.com>',
	to: email,
	subject: 'Verifica correo y rapido!',
	html: `<a href="${endpoint}/${code}">Click here<a/>`
	})
}
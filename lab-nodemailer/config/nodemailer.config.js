const nodemailer = require('nodemailer')

const host = process.env.HOST || 'http://localhost:3000'

const user = process.env.NM_USER
const pass = process.env.NM_PASS

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass
  }
})

module.exports.sendValidationEmail = (username, email, confirmationCode) => {
  transport.sendMail({
    to: email,
    from: `Nodemailer Lab <${username}>`,
    subject: 'Activate your account',
    html: `
			<h1>Hi ${username}!</h1>
			<p>Click on the button below to activate your account</p>
			<a href="${host}/auth/confirm/${confirmationCode}">Activate account</a>
		`
  })
}

const nodemailer = require('nodemailer');

const host = process.env.HOST || 'http://localhost:3000';
const user = process.env.NM_USER;

const transport = nodemailer.createTransport(
	{
		service: 'Gmail',
		auth: {
			user: user,
			pass: process.env.NM_PASS
		}
	}
)

module.exports.sendValidationEmail = (email, confirmationCode, name) => {
	transport.sendMail({
		to: email,
		from: `❤️ IronHack >>> Lab-nodemailer <${user}>`,
		subject: 'Activate your account here!',
		html: `
			<h1>Hi ${name}</h1>
			<p>Click on the button below to activate your account ❤️</p>
			<a href="${host}/auth/confirm/${confirmationCode}" style="padding: 10px 20px; color: white; background-color: black; border-radius: 5px;">Click here</a>. Or copy and paste this link <br><br><code>${host}/auth/confirm/${confirmationCode}</code> on your browser.
			THANS SEU'SON :P
		`
	})
}

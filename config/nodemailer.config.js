const nodemailer = require('nodemailer');

const user = process.env.NM_USER;
const pass = process.env.NM_PASS;
const host = process.env.HOST || 'http://localhost:3000'

const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: user,
		pass: pass
	}
});

module.exports.sendValidationEmail = (username, email, confirmationCode) => {
	transport.sendMail({
		to: email,
		from: `Ironhack nodemailer lab! <${username}>`,
		subject: 'Activate your account!',
    html: `
				<div>
					<h4>Ironhack-Lab-Nodemailer</h4>
				</div>
				<div>
					<img src="images/ironhack.png" alt="Ironhack logo" / >
					<h1>Ironhack confirmation email</h1>
					<h3>Hello ${username}!</h3>
					<p>Thanks to join our community! Please confirm your account clicking on the following link:</p>
					<a href="${host}/auth/confirm/${confirmationCode}">${host}/auth/confirm/${confirmationCode}</a>
					<h2>Great to see you creating awesome webpages with us!😎</h2>
				</div>
				<div>
					<p>You are doing awesome!💙</p>
				</div>
			`

	})
}
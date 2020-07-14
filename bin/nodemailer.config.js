require('dotenv').config()
const nodemailer = require('nodemailer');

const user = process.env.NM_USER;
const pass = process.env.NM_PASS;

const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: user,
		pass: pass
	}
});

module.exports.handleForm = (name, email, confirmationCode) => {
	transport.sendMail({
		to: email,
		from: `Please confirm your account! <${user}>`,
		subject: 'We have received your feedback!',
		html: `<div style='text-align:center;'>
			<img src='cid:ironhackphoto' width='500' />
			<h1>Ironhack Confirmation Email!</h1>
			<h2>Hello ${name}</h2>
			<p> Thanks to join our community! Please confirm your account clicking on the following link:</p>
			<a href=http://localhost:3000/auth/confirm/${confirmationCode}> Confirm your account here </a>
			<h3>Great to see you reating aresome webpages you with us!🤗🤗</h3>
			</div>`,
			attachments: [{
					filename: 'ironhack.png',
					path: 'public/images/ironhack.png',
					cid: 'ironhackphoto' //same cid value as in the html img src
			}]
	})
}
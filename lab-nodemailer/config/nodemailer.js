require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.EMAILUSER,
		pass: process.env.EMAILPASS
	}
});

exports.sendConfirmationEmail = (email, confirmationCode, username) => {
	return transporter.sendMail({
		from: `"${process.env.EMAILSENDERNAME}" ${process.env.EMAILSENDEREMAIL}`,
		to: email,
		subject: "Confirm your account",
		html: `<div style="width: 100%; background-color: #fff; display:flex; flex-direction: column; align-items: center">
		<img width="100px" height="100px" src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4017/s300/logo-ironhack-blue.png" alt="" />
		<h1 >Ironhack Confirmation Email</h1>
		<h2 >Hello ${username}!</h2>
		<p>Thanks for joining our community! Please confirm your account by clicking on the following link:</p>
		<a  href="http://localhost:3000/auth/confirm/${confirmationCode}">Click here to confirm your account</a>
	</div>`
	});
};

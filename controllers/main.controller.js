const nodemailer = require('../config/nodemailer.config');


module.exports.handleForm = (req, res, next) => {
	const { username, email, confirmationCode } = req.body;
	nodemailer.handleForm(username, email, confirmationCode);
	res.redirect('/');
} 
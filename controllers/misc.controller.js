const Email = require("../models/Email.model");
const nodemailer = require('nodemailer');
const User = require("../models/Email.model");
const { Mongoose } = require("mongoose");
const { sendActivationEmail } = require("../config/mailer.config");
//const templates = require("../config/templates/templates");

module.exports.home = (req, res, next) => {
	res.render("home");
};

module.exports.register = (req, res, next) => {
	res.render("auth/signup");
}

module.exports.doRegister = (req, res, next) => {
	console.log(req.body)
	function renderWithErrors(errors) {
        console.error('password: ', errors.password)
        res.status(400).render('auth/signup', {
          errors: errors,
          user: req.body
        })
	  }
	
	  User.findOne({ email: req.body.email })
	  	.then(user => {
			  if(user) {
				  renderWithErrors({
					  email: 'Este email ya existe'
				  })
			  } else {
				User.create(req.body)
					.then(createdUser => {
						sendActivationEmail(createdUser.email, createdUser.activationToken)
						res.redirect('/')
					})
					.catch(err => {
						if (err instanceof mongoose.Error.ValidationError) {
							renderWithErros(err.errors)
						} else {
							next(err)
						}
					})
			  }
		})
		.catch(err => next(err));
}

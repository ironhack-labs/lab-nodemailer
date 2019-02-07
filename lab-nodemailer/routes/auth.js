const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'carlosironhack2019',
		pass: `IRON2019`
	}
});

router.get('/login', (req, res, next) => {
	res.render('auth/login', { message: req.flash('error') });
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureFlash: true,
		passReqToCallback: true
	})
);

router.get('/signup', (req, res, next) => {
	res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	if (username === '' || password === '') {
		res.render('auth/signup', { message: 'Indicate username and password' });
		return;
	}

	User.findOne({ username }, 'username', (err, user) => {
		if (user !== null) {
			res.render('auth/signup', { message: 'The username already exists' });
			return;
		}

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(password, salt);

		const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let token = '';
		for (let i = 0; i < 25; i++) {
			token += characters[Math.floor(Math.random() * characters.length)];
		}

		const newUser = new User({
			username,
			password: hashPass,
			email: email,
			confirmationCode: token
		});

		newUser.save().then(() => {
			res.redirect('/');
			transporter
				.sendMail({
					from: '"My Awesome Project 👻" <myawesome@project.com>',
					to: email,
					subject: subject,
					text: message,
					html: `<b>${message}</b>`
				})
				.then((info) => res.render('message', { email, subject, message, info }))
				.catch((error) => console.log(error));
		});
	}).catch((err) => {
		res.render('auth/signup', { message: 'Something went wrong' });
	});
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// router.get(“/confirm/:confirmCode”, (req, res, next) => {
//   User.findOne({ confirmationCode: req.params.confirmCode }).then(user => {
//    if (user !== null) {
//     User.findByIdAndUpdate(user._id, { status: “Active” }).then(user =>
//      res.render(“auth/confirmation”, { user })
//     );
//     return;
//    }
//    res.redirect(“/auth/signup”);
//   });
//  });

//  router.get(“/profile/:id”, (req, res, next) => {
//   User.findById(req.params.id).then(user => {
//     console.log(user)
//     res.render(“auth/profile”), {user};
//   });
//  });

module.exports = router;

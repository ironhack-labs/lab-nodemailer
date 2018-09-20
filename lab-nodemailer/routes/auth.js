const express = require("express");
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../mail/sendMail');
const fs = require('fs');
const hbs = require('hbs');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
	res.render("auth/login", {
		"message": req.flash("error")
	});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/auth/profile",
	failureRedirect: "/auth/login",
	failureFlash: true,
	passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
	res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	if (username === "" || password === "") {
		res.render("auth/signup", {
			message: "Indicate username and password"
		});
		return;
	}

	User.findOne({
		username
	}, "username", (err, user) => {
		if (user !== null) {
			res.render("auth/signup", {
				message: "The username already exists"
			});
			return;
		}

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(password, salt);
		const hashUsername = encodeURI(bcrypt.hashSync(username, salt)).replace("/", "");

		const newUser = new User({
			username,
			password: hashPass,
			confirmationCode: hashUsername,
			email
		});

		newUser.save()
			.then(user => {
				let subject = 'Account Confirmation';
				let template = hbs.compile(fs.readFileSync('./views/auth/email.hbs').toString());
				let html = template({user:user});
				return sendMail(user.email, subject, html);
			})
			.then(() => {
				res.redirect("/");
			})
			.catch(err => {
				res.render("auth/signup", console.log(err));
			})
	});
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res) => {
	const confirmationCode = req.params.confirmCode;
	User.findOneAndUpdate( {confirmationCode} , {status: 'Active'})
	.then((user) => {
		res.render("auth/confirmation", {user} );
	})
	.catch((err) => {
		console.log(err);
	})
})

router.get('/profile', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
	const user = req.user;
	res.render('auth/profile', {user});
})

module.exports = router;
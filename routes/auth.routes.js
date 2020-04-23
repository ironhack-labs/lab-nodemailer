const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer')

const User = require('../models/user.model');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
	token += characters[Math.floor(Math.random() * characters.length)];
}

// User signup
router.get('/signup', (req, res) => res.render('auth/signup'));
router.post('/signup', (req, res, next) => {
	const { username, password, email } = req.body;

	if (!username || !password) {
		res.render('auth/signup', { errorMsg: 'Rellena el usuario y la contraseña' });
		return;
	}

	User.findOne({ username })
		.then((user) => {
			if (user) {
				res.render('auth/signup', { errorMsg: 'El usuario ya existe en la BBDD' });
				return;
			}
			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);

            let mailer = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'amurawczik@gmail.com',
                    pass: 'Amurawczik183'
                }
            })
            
            let message = `http://localhost:3000/auth/confirm/${token}`
            mailer.sendMail({
                from: 'alex',
                to: email,
                subject: "Haz click en el enlace",
                text: message,
                html: `<b>${message}</b>`
            })
                .then((info) => console.log(info))
                .catch(err => console.log(err))
            
            User.create({ username, password: hashPass, email, confirmationCode: token })
                .then(() => res.redirect('/'))          
                .catch(() => res.render('auth/signup', { errorMsg: 'No se pudo crear el usuario' }))
		})
		.catch((error) => next(error));
});

router.get('/auth/confirm/:confirmCode', (req, res, next) => {
    User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { status: "Active" }, { new: true })
        .then((updatedUser) => res.render('auth/confirmation', { updatedUser }))
        .catch(err => console.log(err))
})


// User login
router.get('/login', (req, res) => res.render('auth/login', { errorMsg: req.flash('error') }));
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true,
		badRequestMessage: 'Rellena todos los campos'
	})
);

// User logout
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

module.exports = router;

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const transporter = require('../mail/transporter');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }

    const { username, password, email } = req.body;

    if (username === "" || password === "" || email === "") {
        res.render("auth/signup", { message: "Indicate username,password and email" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        // const code = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        // const hashCode = bcrypt.hashSync(code, salt);



        const newUser = new User({
            username,
            password: hashPass,
            email,
            confirmationCode: token
        });

        newUser.save()
            .then(() => {
                console.log(transporter)
                transporter.sendMail({
                    from: '"My Awesome Project 👻" <myawesome@project.com>',
                    to: email,
                    subject: 'Awesome Subject',
                    text: 'Awesome Message',
                    html: `<b>http://localhost:3000/auth/confirm/${newUser.confirmationCode}</b>`
                })
            })
            .catch(err => {
                res.render("auth/signup", { message: "Something went wrong" });
            })
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res, next) => {
    let confCode = req.params.confirmCode
    User.findByIdAndUpdate({ confirmationCode: confCode }, { $set: { status: 'Active' } }, { new: true })
        .then(user => { res.render('confirmation', { user }) })
        .catch(error => next(error))
})


module.exports = router;
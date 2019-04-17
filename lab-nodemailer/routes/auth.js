const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }

        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let confirmationCode = '';
        for (let i = 0; i < 25; i++) {
            confirmationCode += characters[Math.floor(Math.random() * characters.length)];
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass,
            confirmationCode,
            email
        });

        newUser.save()
            .then(() => {
                router.post('/send-email', (req, res, next) => {
                    let { email, subject, message } = req.body;
                    let transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'madwebmar19@gmail.com',
                            pass: 'iron2019'
                        }
                    });
                    transporter.sendMail({
                            from: '"My Awesome Project 👻" <bill.gates@ironhack.com>',
                            to: email,
                            subject: subject,
                            text: message,
                            html: `<b>${message}</b>`
                        })
                        .then(info => res.json({ email, subject, message, info }))
                        // .catch(error => console.log(error));
                });
                res.redirect("/");
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

module.exports = router;
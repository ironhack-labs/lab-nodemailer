// Original Requirements
const express = require("express");
const passport = require('passport');
const router = express.Router();

// New Requirements
const validator = require("email-validator");
const nodemailer = require("nodemailer")

// Modesl Requirements
const User = require("../models/User");

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
    const email = req.body.email

    if (username === "" || password === "" || email === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }
        // Generador de confirmationcode

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
        console.log(newUser)
        newUser.save()
            .then(() => {
                res.redirect("/");
            })
            .catch(err => {
                console.log(err)
                res.render("auth/signup", { message: "Something went wrong" });
            })


        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'pedroescobarelnegro@gmail.com',
                pass: 'habana2019.'
            }
        });
        transporter.sendMail({
                from: '"My Awesome Project 👻" <myawesome@project.com>',
                to: email,
                subject: "Hola caracola",

                html: '<p>You have to confirm your email. Please, visit this link:</p><p><a href="http://localhost:4000/auth/confirm/' + confirmationCode + '" target="_blank">Haz clic aquí</a></p>'
            })
            .then(info => res.render('message', { email, subject, message, info }))
            .catch(error => console.log(error));
    });
});

router.get("/confirm/:token", (req, res) => {
    const confirm = req.params.token
    User.findOneAndUpdate({ confirmationCode: confirm }, { status: "Active" }, { new: "true" })
        .then(user => {
            res.render("/")
        })
        .catch(err => "Los sentimos " + err)

})


router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

//Post rout for sending email






module.exports = router;
const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

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
    const { username, password, email } = req.body
    const confirmationCode = (() => {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        for (let i = 0; i < 25; i++) {
            token += characters[Math.floor(Math.random() * characters.length)];
        }
        return token
    })()
    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass,
            email,
            confirmationCode
        });

        newUser.save()
            .then(() => {
                transporter.sendMail({
                        from: '"My Awesome Project" pollabrava.com>',
                        to: email,
                        subject: "Bienvenido a pepelandia!",
                        text: "Confirmación de registro",
                        html: `<b>Confirmación de registro</b>
                        <a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirma tu registro</a>`
                    })
                    .then(info => res.redirect(`/`))
                    .catch(error => console.log(error))

            })
            .catch(err => {
                res.render("auth/signup", { message: "Something went wrong" });
            })
    });
});

router.get("/confirm/:confirmCode", (req, res) => {
    const confCode = req.params.confirmCode
    User.updateOne({ "confirmationCode": confCode }, { $set: { status: "Active" } })
        .then(user => res.redirect(`/auth/profile/${user.username}`))
        .catch(e => console.log(`error: ${e}`))

});

router.get("/profile/:name", (req, res) => {
    const name = req.params.name
    User.findOne()
        .then(user => {
            console.log("funciona")
            res.render(`profile`, { user });
        })
        .catch(e => console.log(`error: ${e}`))

});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASS
    }
})


router.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }

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
            email: email,
            confirmationCode: token
        });

        newUser.save()
            .then(() => {
                transporter.sendMail({
                        from: `"My Awesome Project 👻<franchog79@gmail.com>`,
                        to: email,
                        subject: 'Awesome Subject',
                        text: 'Awesome Message',
                        html: `<!DOCTYPE html>
                        <html lang="en">
                        
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <meta http-equiv="X-UA-Compatible" content="ie=edge">
                          <title>{{title}}</title>
                          <link rel="stylesheet" href="/stylesheets/style.css" />
                        </head>
                        
                        <body>
                          <title> CONFIRMATION EMAIL </title>
                          <h1> THE BEST EMAIL OF YOUR LIVE! </h1>
                          <img src="https://media2.giphy.com/media/mXnO9IiWWarkI/giphy.gif?cid=790b76115d1cb5df4542566b6363266f&rid=giphy.gif"
                            alt="" height="auto">
                          <a href="http://localhost:3000/auth/confirm/${token}">Confirm the sign up</a>
                        </body>
                        
                        </html>`
                    })
                    .then(info => console.log(info))
                    .catch(error => console.log(error))
                res.redirect("/");
            })
            .catch(err => {
                res.render("auth/signup", { message: "Something went wrong" });
            })
    });
});

router.get("/confirm/:token", (req, res) => {
    let token = req.params.token;
    User
        .findOneAndUpdate({ confirmationCode: req.params.token }, { $set: { status: "Active" } }, { new: true })
        .then((user) => {
            console.log("User Activated");
            res.redirect("/auth/login")
        }).catch((err) => {
            console.log(err);
        })

});

router.get("/profile", (req, res) => {
    res.render("auth/profile", { "message": req.flash("error") })
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
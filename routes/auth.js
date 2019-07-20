const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const { sendConfirmationEmail } = require("../config/nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
    res.render("auth/login", { message: req.flash("error") });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/auth/login",
        failureFlash: true,
        passReqToCallback: true
    })
);

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (username === "" || password === "" || email === "") {
        res.render("auth/signup", { message: "Indicate username, password and email" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let token = "";
        for (let i = 0; i < 25; i++) {
            token += characters[Math.floor(Math.random() * characters.length)];
        }

        const newUser = new User({
            username,
            password: hashPass,
            confirmationCode: token,
            email
        });

        newUser
            .save()
            .then(() => {
                sendConfirmationEmail(email, token, username)
                    .then(info => {
                        console.log(info);
                        res.redirect("/");
                    })
                    .catch(err => {
                        console.log(err);
                        res.render("auth/signup", { message: "Something went wrong" });
                    });
            })
            .catch(err => {
                console.log(err);
                res.render("auth/signup", { message: "Something went wrong" });
            });
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/confirm/:confirmationCode", (req, res) => {
    const { confirmationCode } = req.params;
    console.log("confirmationCode: ", confirmationCode);
    User.findOneAndUpdate({ confirmationCode }, { status: "Active" }, { new: true })
        .then(user => {
            console.log("User confirmed: ", user);
            res.redirect("/auth/login");
        })
        .catch(err => {
            console.log(err);
            res.render("auth/login", { message: "Something went wrong trying to confirm" });
        });
});

module.exports = router;
const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/confirm/:confirmCode", (req,res,next)=>{
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, {$set:{"status":"Active"}})
  .then(()=> res.redirect("/profile"))
  .catch(e=>console.log(e))
});

authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const rol = req.body.role;
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
        const confirmationCode = bcrypt.hashSync(username, salt);


        const newUser = new User({
            username,
            email,
            password: hashPass,
            role: "teacher",
            confirmationCode
        });

        newUser.save((err) => {
            if (err) {
                res.render("auth/signup", { message: "Something went wrong" });
            } else {
                res.redirect("/");
                let message = {
                    from: "hugo.gtz.g@gmail.com",
                    to: email,
                    subject: "Tu código de confirmación",
                    html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">Hey-yo, confirma</a>`
                };
                transporter.sendMail(message);
            }
        });
    });

});

authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = authRoutes;
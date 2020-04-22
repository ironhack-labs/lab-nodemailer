const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const mailer = require('../configs/nodemailer.config')


// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }

    const { username, password, email } = req.body

    if (!username || !password) {
        res.render("auth/signup", { errorMsg: "Rellena el usuario y la contraseña" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe en la BBDD" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass, email, confirmationCode: token, status: "Pending Confirmation" })
                .then(createdUser => {

                    res.redirect("/")

                    mailer.sendMail({
                        from: '"Rick Sanchez lab" <lolaso.com>',
                        to: createdUser.email,
                        subject: "Please confirm your e-mail",
                        text: `Hi ${createdUser.username}! Please, confirm your e-mal: ${createdUser.confirmationCode}
                        Go to here: http://localhost:3000/auth/confirm/${createdUser.confirmationCode}`,
                        html: `<b>Hi ${createdUser.username}! Please, confirm your e-mal: <a href="http://localhost:3000/auth/confirm/${createdUser.confirmationCode}">Click Here!</a></b>`
                    })
                        .then(info => console.log("E-mail sent!", info))
                        .catch(error => console.log(error))
                })
                .catch(() => res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" }))
        })
        .catch(error => next(error))
})

// User login
router.get('/login', (req, res) => res.render('auth/login', { "errorMsg": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}))

// User Confirm
router.get('/auth/confirm/:confirmationCode', (req, res, next) => {
    const confirmationCode = req.params.confirmationCode
    console.log("Confirmated", confirmationCode)
    User.updateOne({confirmationCode}, {status: "Active"})
        .then(confirmedUser => {
            console.log("----------------------------------",confirmedUser)
            res.render('auth/confirmed')
        })
        .catch(error => next(error))
})

// User logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router
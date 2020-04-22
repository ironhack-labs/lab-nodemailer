const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")
const mailer = require('../configs/nodemailer.configs')
const bcrypt = require("bcrypt")
const bcryptSalt = 10

// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, email, password } = req.body

    if (!username || !password || !email) {
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

            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let token = '';
            for (let i = 0; i < 25; i++) {
                token += characters[Math.floor(Math.random() * characters.length)];
            }

            User.create({ username, email, password: hashPass, confirmationCode: token })
                .then(() => {
                    mailer.sendMail({
                        from: 'Cosas innecesarias.com',
                        to: email,
                        subject: 'Cosas innecesarias',
                        text: `http://localhost:3000/auth/confirm/${token}`,
                        html: `<b>http://localhost:3000/auth/confirm/${token}</b>`
                    })
                })
                .then(() => res.redirect("/"))
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


router.get('/auth/confirm/:confirmationCode', (req, res) => {
    const code = req.params.confirmationCode
    User.updateOne({ confirmationCode: code }, { status: "Active" })
        .then(res.render('auth/confirmation'))
        .catch(err => console.log('No se ha podido cambiar el status'))
})



// User logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router
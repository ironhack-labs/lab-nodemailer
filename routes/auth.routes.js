const express = require("express")
const router = express.Router()
const passport = require("passport")

const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'hector.ironhack@gmail.com',
        pass: 'iron-hack3r'
    }
})

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, password, email } = req.body

    if (!username || !email || !password) {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
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

            //TOKEN
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let token = '';
            for (let i = 0; i < 25; i++) {
                token += characters[Math.floor(Math.random() * characters.length)];
            }

            User.create({ username, password: hashPass, email, confirmationCode: token })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" }))

            //ENVÍO DE EMAIL
            const message = `Pinche en el siguiente enlace para confirmar el registro: http://localhost:3000/auth/confirm/${token}`

            transporter.sendMail({
                from: '"Bienvenido a la BBDD del lab" <hector.ironhack@gmail.com>',
                to: email,
                subject: 'Confirmation code',
                text: message,
                html: `<b>${message}</b>`
            })
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


// User logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

router.get('/auth/confirm/:confirmationCode', (req, res, next) => {
    User.findOneAndUpdate({ confirmationCode: req.params.confirmationCode }, { status: 'Active' }, { new: true })
        .then(updatedUser => {
            console.log(updatedUser);
            res.render('confirmation', { user: updatedUser })
        })
        .catch()
})


module.exports = router
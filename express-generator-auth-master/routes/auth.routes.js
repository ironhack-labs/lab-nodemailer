const express = require("express")
const router = express.Router()
const passport = require("passport")
const nodemailer = require('nodemailer')

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const randomToken = require('random-token')

// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {
    
    let token = randomToken(25)

    const { username, password, email } = req.body

    if (!username || !password) {
        res.render("auth/signup", {
            errorMsg: "Rellena el usuario y la contraseña"
        })
        return
    }

    User.findOne({ username})
        .then(user => {
            if (user) {
                res.render("auth/signup", {
                    errorMsg: "El usuario ya existe en la BBDD"
                })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            let mailer = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'yaiza.ih.proof@gmail.com',
                    pass: 'unintended'
                }
            })

            let message = `Este es tu codigo de confirmación: http://localhost:3000/auth/confirm/${token}`
            mailer.sendMail({
                from: 'Yai con amor',
                to: email,
                subject: 'Aqui tienes tu confirmation code',
                text: message,
                html: `<b>${message}</b>`
            })
                
            .then(info => console.log(info))
            .catch(err => console.log('no se ha enviado el email, torpe', err))

            User.create({username, password: hashPass, email, confirmationCode: token})
            .then(() => res.redirect("/"))
            .catch(() => res.render("auth/signup", {errorMsg: "No se pudo crear el usuario"}))
        })
        .catch(error => next(error))
})

router.get('/auth/confirm/:confirmCode', (req, res, next) => {

    User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { status: 'Active' }, {new: true})
        .then(updatedUser => res.render('auth/confirmation', {updatedUser} ))
        .catch(err => console.log('No has hecho ná', err))
    
})


// User login
router.get('/login', (req, res) => res.render('auth/login', {
    "errorMsg": req.flash("error")
}))
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

module.exports = router
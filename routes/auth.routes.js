const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const mailer = require('../configs/nodemailer.config')
const randomToken = require('random-token')


// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    let token = randomToken(16)

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

            let message = `Su codigo de confirmación es: http://localhost:3000/auth/confirm/${token}`
            let subject = `Codigo de confirmacion para ExpressNodemailer`

            mailer.sendMail({
                from: '"Tu peor pesadilla👻"',
                to: email,
                subject: subject,
                text: message,
                html: `<b>${message}</b>`
              })
                .then(info => console.log(info))
                .catch(error => console.log('No se ha mandado el mail', error));

            User.create({ username, password: hashPass, email, confirmationCode: token })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" }))
        })
        .catch(error => next(error))
})

router.get('/auth/confirm/:confirmCode', (req, res, next) => {

    User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { status: 'Active' }, {new: true})
        .then(updatedUser => res.render('auth/confirmation', {updatedUser} ))
        .catch(err => console.log('No se ha confirmado tu cuenta', err))

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

module.exports = router
const express = require("express")
const router = express.Router()
const passport = require("passport")
const mailer = require('../configs/nodemailer.config')
const template = require("../templates/template")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    //const { username, password } = req.body


    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }

    let { username, password, email } = req.body
    let confirmationCode = token

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

            User.create({ username, password: hashPass, email, confirmationCode })
                .then(() => {
                    let message = 'test message'
                    mailer.sendMail({
                        from: '<testfordev2@gmail.com>',
                        to: email,
                        subject: 'Confirmation Email',
                        text: message,
                        html: template.template(confirmationCode)
                    })
                    res.redirect("/profile")
                })
                .catch((err) => {
                    console.log(err)
                    res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" })
                })
        })
        .catch(error => next(error))
})


// User login
router.get('/login', (req, res) => res.render('auth/login', { "errorMsg": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/profile",
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
//

router.get('/auth/confirm/:confirmCode', (req, res, next) => {

    User.findOneAndUpdate({ confirmationCode: req.params.confirmCode },
        { status: 'Active' }, { new: true })
        .then(updateStatus => res.render('confirmation', { updateStatus }))
        .catch(err => next(err))

})

const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

router.get('/profile', ensureLoggedIn, (req, res) => res.render('profile', req.user))


module.exports = router

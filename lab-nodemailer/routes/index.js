const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('../config/passport')
const {
    sendRe
} = require('../config/nodemailer')



/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
})

router.get('/auth/signup', (req, res, next) => {
    res.render('auth/signup')
})
router.post('/auth/signup', (req, res, next) => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    const {
        email,
        name,
    } = req.body
    sendRe(email, name, token)
    User.register({
            ...req.body,
            confirmationCode: token
        }, req.body.password)
        .then(user => {

            res.send('Usuario registrado, por favor confirma tu email')
        })
        .catch(err => {
            res.send(err)
        })
})

router.get('/auth/confirm/:confirmationCode', (req, res, next) => {
    const {
        confirmationCode
    } = req.params
    User.findOneAndUpdate({
            confirmationCode
        }, {
            status: "Active"
        }, {
            new: true
        })
        .then(user => {

            res.redirect("/auth/profile")
        })
        .catch(err => {
            console.log(err)
            res.render("auth/signup", {
                message: "Ups, algo salió mal"
            });
        })
})

router.get('/auth/profile', (req, res, next) => {

    res.render('auth/profile')

})

router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})

module.exports = router;
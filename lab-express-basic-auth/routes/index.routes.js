const express = require('express')
const router = express.Router()
const signup = require('../controllers/signup.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const nodemailer = require('../configs/nodemailer.config')
const User = require('../models/User.model')

/* GET home page */
router.get('/', signup.drawIndex)

router.get('/login', signup.drawLogin)
router.post('/login', signup.doLogin)

router.get('/signup', signup.drawSignup)
router.post('/signup', signup.createUser)

router.get('/profile', sessionMiddleware.isAuthenticated, signup.drawProfile)

router.post("/logout", sessionMiddleware.isAuthenticated, signup.logout)

router.get('/confirm/:confirmationCode', (req, res, next) => {
    User.findOne({confirmationCode : req.params.confirmationCode})
       .then(user => {
         if (user){
            user.status = "active"
            user.save()
                .then(() => res.render('index', { message : "You can log in now"}))
                .catch(() => res.render('signup', { message : "Impossible to validate "}))
            }
       })
       .catch((e) => console.log("error", e))
 });

module.exports = router

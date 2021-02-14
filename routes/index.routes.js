const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const secure = require('../middlewares/secure.middleware')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// User routes
router.get('/register', secure.isNotAuthenticated, userController.register)
router.post('/register', secure.isNotAuthenticated, userController.doRegister)
router.get('/login', secure.isNotAuthenticated, userController.login)
router.post('/login', secure.isNotAuthenticated, userController.doLogin)
router.get('/profile', secure.isAuthenticated, userController.profile)
router.post('/logout', secure.isAuthenticated, userController.doLogout)
router.get("/activate/:token/:username", secure.isNotAuthenticated, userController.activate);

module.exports = router;

const {confirmAccount} = require('../config/nodemailer')
const User = require('../models/User')

exports.loginView = (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
}

exports.signupView = (req, res, next) => {
    res.render("auth/signup");
}

exports.signup = async (req, res, next) => {
    const {username, email, password} = req.body

    if (username === "" || password === "") {
      res.render("auth/signup", { message: "Indicate username and password" });
      return;
    }

    const user = await User.findOne({ email })
    if(user){
      return res.render('auth/signup', {message: 'Ya esta registrado el correo, usa otro'})
    }
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    User.register({username, email, confirmationCode: token}, password)
    confirmAccount(email, token, 'http://localhost:3000/confirm')
    res.redirect('/auth/login')
};

exports.logout = (req, res) => {
    req.logout()
    res.redirect('/')
}

exports.verify = async (req, res, next) => {
    const {code} = req.params
    await User.findOneAndUpdate({confirmationCode: code},{status: 'Active'}, {new: true})
    res.render('profile')
}
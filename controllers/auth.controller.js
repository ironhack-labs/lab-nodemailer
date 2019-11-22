require("dotenv").config();

const User = require("../models/User");

const {
  transporter
} = require("../controllers/email");

exports.signupGet = (_, res) => res.render("auth/signup");

exports.signupPost = (req, res, next) => {
  const { username, email, password, passwordrepeat } = req.body;

  if(password !== passwordrepeat) {
    return res.render("auth/signup", {
      msg: "Password must be the same"
    });
  }

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }

  User.register({ username, email, token }, password)
    .then(user => {
      //EMAIL
       transporter.sendMail({
        from: "Carlos e Itza <itza.lp@gmail.com>",
        to: email,
        subject: `Ironhack Confirmation Email`,
        html: `<img src="https://cdn-images-1.medium.com/max/1200/1*69RcxrWXuk385lSxkIYYLA.png" alt="Ironhack" style="width:300px;height:300px; ">
        <h3>Hello ${username} <h3>
        <p>Thanks to join our community! 
        Please confirm your account clicking on the following link:</p>
        <br/>
        <a href="http://localhost:3000/confirm/${token}">Confirm e-mail</a>`,
      });
      res.redirect("/")
    })
    .catch(err => {
      if (err.username === "UserExistsError") {
        return res.render("auth/signup", {
          msg: "Already registered"
        });
      }
    });
};

exports.loginGet = (req, res) => {
  res.render("auth/login");
};

exports.profileGet = (req, res) => {
  res.render("/profile", { user: req.user });
};

exports.isLoggedIn = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect("/auth/login");
};

exports.isNotLoggedIn = (req, res, next) => {
  !req.isAuthenticated() ? next() : res.redirect("/profile");
};
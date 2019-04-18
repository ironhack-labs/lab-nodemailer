const express = require("express");
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/perfil",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

  //pedimos los parametros
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;


  // token
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  let confirmationCode = token;

  // no lo dejes en blanco
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });

    return;
  }
  //chequeo que no este creado
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }
    //  creo la sal
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    // Creo el usuario
    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: confirmationCode
    });
    // Lo guardo yyyy algo mas
    newUser.save()
      .then(
        res.render("rafa/guardado"),
        {username}
      )
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
  // Mando el Correo
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: `${process.env.MAIL}`,
      pass: `${process.env.CONTRASEÑA}`
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email,
    subject: `Confirmacion de cuenta de ${username}`,
    html: `<a href="http://localhost:3000/auth/confirmado/${confirmationCode}">Link</a>`
  })

});

router.get('/confirmado/:confirmCode', (req,res) =>{
  let code = req.params.confirmCode
  User.findOneAndUpdate(
    { confirmationCode:code },
    {status:"Active"}
 ).then(user =>
   res.render("rafa/confirmado", {user})
 )
});

router.get("/perfil",ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let yo = req.user
  res.render("rafa/perfil",{yo})
})


router.post('/perfil', (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: `${process.env.MAIL}`,
      pass: `${process.env.CONTRASEÑA}`
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => res.render('rafa/mandado', {email, subject, message, info}))
  .catch(error => console.log(error));
});

router.get("/mail-mandado", (req, res, next) => {
  res.render("rafa/mandado")
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

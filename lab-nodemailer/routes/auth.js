const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const nodemailer = require("nodemailer");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Este post recibe la información procedente del formulario
router.post("/signup", (req, res, next) => {

  // Declaramos variables en las que almacenaremos el nombre de usuario,
  // el password y la dirección de correo electrónico
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  // Declaramos una variable para almacenar todos los caracteres que
  // pueden incluirse la clave de confirmación que enviaremos al usuario
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Declaramos una variable en la que almacenaremos la clave de cofirmación
  let token = '';

  // En el siguiente bucle asiganmos a la variable token el valor aleatorio
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  // En este condicional indicamos que en caso de que falten el usuario,
  // el password o el email nos salimos de post
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  //Aquí empleamos el método findOne para buscar alguna coincidencia
  // con el username insertado. En caso de existir salimos del post.
  // En caso contrario ,creamos el hashPass, el objeto de la clase User,
  // que contiene los datos del usuario
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    //Generamos el salt y se lo añadimos al password. El valor resultante lo
    // almacenamos en la constante hassPass para que se convierta en una
    // mejora de nuestro password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // Declaramos un nuevo objeto de la clase User
    const newUser = new User({

      username: username,
      password: hashPass,
      email: email,
      confirmationCode: token

    });

    // Guardamos el nuevo usuario en la base de datos
    newUser.save()
      .then(() => {
        res.redirect("/");
        transporter.sendMail({
          from: '"Lab" <ceciliarubes@gmail.com>',
          to: newUser.email,
          html: `<b>This is a test</b><br>http://localhost:3000/auth/confirm/${newUser.confirmationCode}`
        })
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

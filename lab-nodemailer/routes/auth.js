const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const transporter = require("../models/mail/transporterGmail");
const path = require("path");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  //const rol = req.body.role;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashPassUs = encodeURIComponent(bcrypt.hashSync(username, salt))

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashPassUs,
      email
      //role:"teacher"
    });

    newUser.save()
    .then ((user)=> {
      console.log(user)
      transporter.sendMail({
        from: "Javi y Mapi",
        to: `<${user.email}>`,
        subject: "Javi y Mapi", // Asunto
        html: `<p>http://localhost:3000/auth/confirm/${user.confirmationCode}</p>`
      })
    })
    .then(info => {
      console.log(info);
      res.redirect("/");
    })
    .catch((err) => res.render("auth/signup", { message: "Something went wrong" }))

  });
});
authRoutes.get("/confirm/:confirmCode", (req, res) =>{
  let confirmationCode = encodeURIComponent(req.params.confirmCode)
  User.findOneAndUpdate({confirmationCode}, {"status":"Active"})
  .then( user => res.render("auth/welcome", {user}) )
  .catch( () => res.redirect("/auth/signup"));
})


authRoutes.post("/send-email", (req, res, next) =>{
  let { email, subject, message } = req.body;
  res.render("message", { email, subject, message })
})

authRoutes.get("/profile/:id", (req, res) =>{
  let id = req.params.id
  User.findById(id)
  .then( user => res.render("auth/profile", { user }))
  .catch( () => res.redirect("/auth/signup") );
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

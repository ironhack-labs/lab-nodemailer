const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {username, password, email} = req.body;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = bcrypt.hashSync(email, salt).match(/[A-Za-z1-9]/g).join('');

    const newUser = new User({
      username: username,
      password: hashPass,
      confirmationCode: confirmationCode,
      email: email,
    });

    newUser.save()
    .then(() => {
      let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "207447ea6737c7",
          pass: "04e56fd01e99cf"
        }
      });

      transport.sendMail({
        from: '9e7e4ebfc7-a4f250@inbox.mailtrap.io',
        to: email,
        subject: 'Confirm your e-mail!',
        text: 'Use this adress to confirm your e-mail: ' + process.env.CONFIRMATION_LINK + confirmationCode,
        html: `
        <html>
        <style>
        @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

          div {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            font-family: 'Roboto';
          }

          img {
            width: 200px;
            height: auto;
          }

        </style>
        <body>
        <div>
        <img src='https://secure.meetupstatic.com/photos/event/d/9/3/e/600_473815614.jpeg' alt="logo ironhack" />
        <h1>Ironhack Confirmation Email</h1>
        <h3>Hello, ${username}</h3>
        <p>Thanks to join our community! Please confirm your account <a href="${process.env.CONFIRMATION_LINK + confirmationCode}">clicking here</a></p>
        <h3>Great to see you creating awesome webpages with us! 😍</h3>
        </div>
        </body>
        </html>`
      })
      .then(() => res.redirect("/"))
      .catch(err => console.log(err))
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

router.get("/confirm/:confirmCode", (req, res) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, {status: 'Active'})
  .then(user => {
    if(user) {
      res.render('auth/confirmation', user);
    } else {
      res.render('auth/confirmation', { err: 'erro' } );
    }
  })
  .catch(err => console.log(err));
});

module.exports = router;

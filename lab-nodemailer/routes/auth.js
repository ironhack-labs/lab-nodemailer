const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const templates = require("../templates/template");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}),
async (req, res, next) => {
  await User.findOne({ username: req.body.username }, (err, user) => {
    if (user.status === 'ACTIVE') {
      const { username, status } = user
      res.render('profile', { username, status })
    }
    else {
      res.render('auth/login', { message: 'You must activate your user, please go to your mailbox and verify the account.' })
    }
  })
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user) {
      res.render("auth/signup", { message: "This username already exists" });
      return;
    }

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }

    const confirmCode = token;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmCode
    });

    newUser
      .save()
      .then(async () => {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          }
        })

        const port = process.env.PORT;

        const message = {
          from: `Nodemailer Enterprise <${process.env.EMAIL}>`,
          to: email,
          subject: 'Nodemailer Enterprise verification',
          text: `Verify your account here: http://localhost:${port}/auth/confirm/${confirmCode}`,
          html: templates.template(username, port, confirmCode),
        }

        const info = await transporter.sendMail(message)
        res.render('email-sent', { email })
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong: " + err });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmCode', async (req, res, next) => {
  const confirmCode = req.params.confirmCode
  await User.findOneAndUpdate({ confirmCode, status: 'PENDING CONFIRMATION' }, 'confirmCode', async (err, user) => {
    if (user == null) {
      res.render('auth/email-verification', { message: 'The validation key is wrong!', validation: false });
      return
    }
    user.status = 'ACTIVE'
    await user.save(err => {
      if (err) {
        res.render('auth/email-verification', { message: `There was an error: ${err}`, validation: false })
        return
      }
      res.render('auth/email-verification', { message: 'Your account has been successfully verified', validation: true })
    })
  })
})

module.exports = router;
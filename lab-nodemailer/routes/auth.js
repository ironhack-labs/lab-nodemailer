const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  // successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}), async (req, res, next) => {
  console.log('casi bienvenido...' + req.body.username)
  await User.findOne({ username: req.body.username }, (err, user) => {
    if (user.status === 'ACTIVE') {
      const { username, status } = user
      res.render('profile', { username, status })
    }
    else {
      res.render('auth/login', { message: 'You account is not active yet, please activate with the link into the verifiation email' })
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
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    const confirmCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmCode
    });

    newUser.save()
      .then(async () => {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          }
        })
        const port = req.app.settings.port || process.env.PORT;
        const host = req.protocol + '://' + req.hostname + (port == 80 || port == 443 ? '' : ':' + port);
        const info = await transporter.sendMail({
          from: `Yo mero <${process.env.EMAIL}>`,
          to: email,
          subject: 'Email Verification',
          text: `Please enter to the following link for account verification: ${host}/auth/confirm/${confirmCode}`,
          html: `<p>Please enter to the following link for account verification: <a href="${host}/auth/confirm/${confirmCode}"> ${host}/auth/confirm/${confirmCode}</p>`,
        })
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
      res.render('auth/email-verification', { message: 'The validation key is invalid!', validation: false });
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

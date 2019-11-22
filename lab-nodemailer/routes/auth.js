const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { transporter } = require("../controllers/email");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username, password and email."
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = generateToken();

    const newUser = new User({
      username,
      password: hashPass,
      status: "Pending Confirmation",
      confirmationCode,
      email
    });

    newUser
      .save()
      .then(async () => {
        await transporter.sendMail({
          from: `lab-nodemailer <${process.env.EMAIL}>`,
          to: email,
          subject: "Bienvenido a nuestra App",
          text: `Código de verificación: http://localhost:3000/auth/confirm/${confirmationCode}`,
          html: `
            <h1>Bienvenido a nuestra App</h1>
            <p>
              Código de verificación:
              <a href="http://localhost:3000/auth/confirm/${confirmationCode}">
                http://localhost:3000/auth/confirm/${confirmationCode}
              </a>
            </p>`
        });
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmationCode", async (req, res, next) => {
  const { confirmationCode } = req.params;
  const user = await User.findOne({ confirmationCode });
  user.status = "Active";
  user.confirmationCode = "";
  await user.save();
  res.redirect("/");
});

module.exports = router;

function generateToken() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

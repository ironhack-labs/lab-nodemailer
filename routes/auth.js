const env = require('dotenv');
env.config();
env.config({path: './.env.private'});

const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const { sendMail } = require("../mailing/sendMail");
const { ensureLoggedIn } = require("../middleware/ensureLogin");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  
  var fieldsPromise = new Promise((resolve, reject) => {
    if (username === "" || password === "" || email === "") {
      reject(new Error("Indicate a username, email and password to sign up"));
    } else if (!validateEmail(email)) {
      reject(new Error("You should write a valid email"));
    } else {
      resolve();
    }
  });

  fieldsPromise
    .then(() => {
      return User.findOne({ username });
    })
    .then(user => {
      if (user) {
        throw new Error("The username already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const confirmationCode = encodeURIComponent(bcrypt.hashSync(username, salt));

      const newUser = new User({
        username,
        email,
        password: hashPass,
        confirmationCode
      });

      return newUser.save();
    })
    .then(user => {
      res.redirect("/");

      const data = {
        url: `http://localhost:3000/auth/confirm/${user.confirmationCode}`
      };

      sendMail(user.email, "Sign up confirmation", data).then(() => {
        console.log("Email sended");
      });
    })
    .catch(err => {
      res.render("auth/signup", {
        errorMessage: err.message
      });
    });
});

authRoutes.get("/confirm/:confirmCode", (req, res) => {
  const confirmCode = encodeURIComponent(req.params.confirmCode);

  User.findOne({ confirmationCode: confirmCode })
    .then(user => {
      if (!user) {
        throw new Error("The confirmation code is incorrect");
      }

      if (user.status === "Active") {
        throw new Error("Your account has already been activated.");
      }

      return User.findOneAndUpdate(user._id, { status: "Active" });
    })
    .then(user => {
      res.render("auth/confirmation", { user });
    })
    .catch(err => {
      res.render("auth/confirmation", { errorMessage: err.message });
    })
});

authRoutes.get("/profile", ensureLoggedIn("/auth/login"), (req, res) => {
  res.render("auth/profile");
});

authRoutes.get("/logout", (req, res) => {
  req.logout();

  res.redirect("/");
});

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = authRoutes;

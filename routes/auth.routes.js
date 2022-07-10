const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// const jwt = require("jsonwebtoken");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const nodemailer = require("nodemailer");
require("dotenv/config");

///////////////////////////////////////////////////////////////////////
/////////////////////////// SIGN UP ///////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password, email } = req.body;
  // const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN},
  // });
  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your username.",
    });
  }
  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("authsignup", { errorMessage: "Username already taken." });
    }
    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        const characters =
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let token = "";
        for (let i = 0; i < 25; i++) {
          token += characters[Math.floor(Math.random() * characters.length)];
        }
        console.log(token);
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          email,
          confirmationCode: token,
        });
      })
      .then((user) => {
        console.log(user);
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD,
          },
        });
        transporter
          .sendMail({
            from: '"My Awesome Project " <antonio.django80@gmail.com>',
            to: email,
            subject: "Confirmation token",
            text: `HI ${user.username} this is your confirmation token`,
            html: `<b>http://localhost:3000/confirm/${user.confirmationCode}</b>`,
          })
          .then((user) => {
            req.session.user = user;
            res.redirect("/profile");
          })
          //     .catch((error) => console.log("Error Occurs!"));

          //   // Bind the user to the session object
          //   req.session.user = user;
          //   res.redirect("/profile");
          // })
          .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
              return res
                .status(400)
                .render("auth/signup", { errorMessage: error.message });
            }
            if (error.code === 11000) {
              return res.status(400).render("auth/signup", {
                errorMessage:
                  "Username need to be unique. The username you chose is already in use.",
              });
            }
            return res
              .status(500)
              .render("auth/signup", { errorMessage: error.message });
          });
      });
  });
});

///////////////////////////////////////////////////////////////////////
////////////////////////  CONFIRMATION ////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/confirm/:confirmCode", (req, res, next) => {
  const userToken = req.params.confirmCode;
  console.log(userToken);
  // const userId = req.session.currentUser._id;
  User.findOneAndUpdate(
    { confirmationCode: userToken },
    {
      status: "Active",
    }
  )
    .then((userData) => {
      if (!userData) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      } else if (userData) {
        console.log(userData.status);
        req.session.user = userData;
        return res.render("auth/confirmation", {
          username: userData.username,
          status: userData.status,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

///////////////////////////////////////////////////////////////////////
/////////////////////////// LOGIN /////////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your username.",
    });
  }
  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }
      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/profile");
      });
    })

    .catch((err) => {
      next(err);
    });
});
///////////////////////////////////////////////////////////////////////
///////////////////////////////LOGOUT//////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;

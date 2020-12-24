const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const nodemailer = require('../configs/mailer.config');
const bcrypt = require('bcrypt');


router.get("/login", (req, res, next) => res.render("auth/login"));

router.post('/login', (req, res, next) => {
  checkForEmptyFields(req.body, 'auth/login', res);
  User.findOne({username: req.body.username})
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password)
          .then(match => {
            if (match) {
              req.session.userId = user._id;
              res.redirect('/home');
            } else {
              failAuth(res);
            }
          })
          .catch(next);
      } else {
        failAuth(res);
      }
    });
});


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  checkForEmptyFields(req.body, 'auth/signup', res);
  checkForDuplicates(req.body.username, res);
  const newUser = new User(req.body);

  newUser.save()
    .then(user => {
      nodemailer.sendValidationEmail(user.email, user.confirmationCode);
      res.send('Check your mailbox');
    })
    .catch(e => console.error(e));
});

router.get('/activate/:token', (req, res, next) => {
  User.findOne({confirmationCode: req.params.token})
    .then(user => {
      if(user) {
        user.status = 'Active';
        user.save()
          .then(user => res.send(user))
          .catch(next);
      }
      else {
        res.send('Can\'t find user');
      }
    })
    .catch(next);
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;




function checkForEmptyFields(formData, view, res) {
  const formValues = Object.values(formData);
  for (let i = 0; i < formValues.length; i++) {
    if (!formValues[i]) {
      res.render(view, {message: 'One or more fields are empty'});
    }
  }
}

function checkForDuplicates(field, res) {
  User.findOne({field}, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }
  });
}

function failAuth(res) {
  res.render('auth/login' ,{message:'Login failed, wrong credentials'});
}
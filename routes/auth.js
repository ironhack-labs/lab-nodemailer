const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

const userEnv = process.env.NM_USER;
const pass = process.env.NM_PASS;


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const { token } = require("morgan");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});


//TODO: Modificar Login para poder comprobar status (user activo) 
// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/panel",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

router.post('/login', (req, res, next) => {
  const userName = req.body.username
  const pass = req.body.password

  User.findOne({username: userName})
  .then(user => {
    if (user) {
      user.checkPass(pass)
      .then(match => {
        if(match) {
          if(user.status) {
            res.render('panel', { user: user })
          } else {
            res.redirect('login')
          }
        } else {
          res.redirect('login')
        }
      })
    } else {
      res.redirect('login')
    }
  })
  .catch(next)

})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let tokenId = '';

  for (let i = 0; i < 25; i++) {
    tokenId += characters[Math.floor(Math.random() * characters.length)];
  }

  if (username === "" || password === "") {
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

    const newUser = new User({
      username,
      password: hashPass,
      email,
      status: false,
      confirmationCode: tokenId
    });

    // console.log(newUser.token)

    newUser.save()
      .then(() => {

        const transport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: userEnv,
            pass: pass
          }
        });

        transport.sendMail({
          to: email,
          from: `Ironhack nodemailer example! <jaimebaroval@gmail.com>`,
          subject: 'We have received your feedback!',
          html: `
                  <h1>Hi ${username}, we have received your feedback!</h1>
                  <p>We have received the following feedback</p>
                  <p>Hello</p>
                  <a href="http://localhost:3000/auth/confirm/${tokenId}" style="padding:10px; background-color:green; border-radius:10px">Confirm</a>
                  <p>We will get back to you soon ❤️</p>
                `
        })

        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })


  });

});

// Confirmation Code
router.get('/confirm/:id', (req, res, next) => {
  const id = req.params.id

  User.findOne({confirmationCode: id})
    .then(user => {
      user.status = true
      user.save()
      .then(() => res.render('auth/confirm', {user}))
      .catch(next)
      
    })
    .catch(next)
  })

  // GET Confirm 
  router.get('/confirm', (req, res, next) => {
    res.render('auth/confirm')
  })

// POST Login
// router.post('/login', (req, res, next) => {
//   const body = req.body
//   User.findOne({ user: body.user })
//       .then(user => {
//           if (user) {
//               user.checkPass(body.password)
//                   .then(match => {
//                       if (match) {
//                           req.session.userId = user._id
//                           res.redirect('/session')
//                       } else {
//                           res.send('Invalid Pass')
//                       }
//                   })
//           } else {
//               res.send('User not found')
//           }
//       })
//       .catch(error => console.error(error))
// })

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

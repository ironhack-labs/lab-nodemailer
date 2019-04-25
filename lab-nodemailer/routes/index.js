const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/signup', (req, res, next) => {
//   res.render('sign')
// })

// router.get('/login', (req, res, next) => {
//   res.render('login')
// })

// router.post('/signup', (req, res, next) => {
//   User.register({ ...req.body }, req.body.password)
//     .then(user => {
//       res.redirect('/login')
//     })
//     .catch(err => {
//       res.send(err)
//     })
// })

// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) return next(err)
//     if (!user) return res.redirect('/login')
//     req.logIn(user, err => {
//       if (err) return next(err)
//       req.app.locals.loggedUser = req.user
//       res.redirect('/profile')
//     })
//   })(req, res, next)
// })

// router.get('/profile', isLogged, /** */(req, res, next) => res.render('profile'))

module.exports = router;

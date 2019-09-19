const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth');
const profileRoutes = require('./profile');


router.use('/auth', authRoutes);




router.get('/', (req, res, next) => {
  res.redirect('/auth/login');
});

router.use('/', profileRoutes);


module.exports = router;

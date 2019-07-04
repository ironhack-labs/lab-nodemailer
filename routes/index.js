const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/auth/profile",  (req, res,next) => {
  console.log(req.user)
  res.render("auth/profile", { user: req.user  });
});

router.get("/auth/message",  (req, res,next) => {
  res.render("auth/message")
});


module.exports = router;

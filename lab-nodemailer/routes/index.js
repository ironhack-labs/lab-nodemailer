const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile/:id', (req, res, next) => {
  let id = req.params.id
  User.findById(id)
  .then(user=>{
    res.render('profile',{user})
  })
  .catch(e=>next(e))
})

module.exports = router;

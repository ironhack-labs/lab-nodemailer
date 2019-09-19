const User = require("../models/User");

module.exports.isUser = (req, res, next) => {
  User.find({username: req.params.user})
    .then(user => {
      if(user.length > 0) {
        res.locals.userProfile = user;
        next();
      } else {
      
        res.status(404);
        res.render('not-found');
      }
    });
}


module.exports.isAuthenticated = (req, res, next) => {
  (req.isAuthenticated()) ? next() : res.redirect('/login');  
}
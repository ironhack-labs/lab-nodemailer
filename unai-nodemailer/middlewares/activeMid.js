module.exports.checkActive = (req, res, next) => {
  console.log("ok")
  if (req.isAuthenticated() && req.user.active) {
    next();
  } else if(req.isAuthenticated()){
    res.redirect('/checkMail');
  } else {
    res.redirect('/auth/signup')
  }
};



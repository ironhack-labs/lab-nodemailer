module.exports.checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports.checkRole = role => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports.checkStatus = status => (req, res, next) => {
  if (req.isAuthenticated() && req.user.status === status) {
    next();
  } else {
    res.redirect('/');
  }
};
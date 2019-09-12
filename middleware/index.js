exports.catchErrors = fn => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

exports.isLoggedIn = (req, res, next) => (req.isAuthenticated() ? next() : res.redirect('/login'));

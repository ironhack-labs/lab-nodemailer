exports.checkUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.app.locals.logged = true;
  } else {
    req.app.locals.logged = false;
  }
  return next();
};

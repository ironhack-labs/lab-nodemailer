const ensureLoggedIn = redirectTo => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      req.flash("error", "You have to login first");
      res.redirect(redirectTo);
    }
  };
};

module.exports = { ensureLoggedIn };
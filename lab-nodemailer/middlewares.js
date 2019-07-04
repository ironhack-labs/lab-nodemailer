function checkLogin(req, res, next) {
  if (req.user) next();
  else res.redirect("/login");
}

function defineUser(req, res, next) {
  res.locals.user = req.user;
  next();
}

module.exports = {
  checkLogin,
  defineUser
};

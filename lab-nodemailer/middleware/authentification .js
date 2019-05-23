const checkActive = url => (req, res, next) => {
  req.user && req.user.status == "Active" ? next() : res.redirect(url);
};

module.exports = checkActive;

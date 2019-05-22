const confirmCode = (url = "/") => (req, res, next) => {

  if (req.user && req.user.status == "active") {
    next()
  } else {
    res.redirect(url);
  }

}

module.exports = confirmCode;
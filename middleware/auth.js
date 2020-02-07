exports.isLogIn = (req,res,next) => {
  req.isAuthenticated() ? next() : res.redirect('/')
}
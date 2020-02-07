exports.isLoggedIn = (req,res,next) => {
  req.isAuthenticated() ? next() : res.redirect('/')
}

exports.isActive = (req,res,next) => {
  req.user.status=="Active" ? next() : res.send('Confirma tu correo')
}
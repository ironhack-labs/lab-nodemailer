module.exports = {
  isActiveAndConnected: function(req,res,next) {
    if(req.user && req.user.status === 'Active') next()
    else res.redirect('/')
  }
}
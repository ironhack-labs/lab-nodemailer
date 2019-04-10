module.exports = {
  checkConnectedAndActive: function(req,res,next) {
    // If the user is connected and its status is active, go to next middleware
    if (req.user && req.user.status === 'Active')
      next()
    else
      res.redirect('/')
  }
} 
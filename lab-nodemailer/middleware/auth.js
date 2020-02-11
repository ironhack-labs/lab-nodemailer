exports.isLoggedIn=(req,res,next)=>{
  req.isAuthenticated()? next() : res.redirect('/')
}

exports.isActive=(req,res,next)=>{
  if(req.user.status=='active'){
    next();
  }else{
    res.send('Confirm your account')
  }
}


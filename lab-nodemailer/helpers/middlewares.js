exports.isActive = function(active){
  return (req,res,next)=>{
    if(req.user.status === active) next()
    else res.send("Please activate your account!")
  }
}
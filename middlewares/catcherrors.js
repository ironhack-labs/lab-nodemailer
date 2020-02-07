exports.catchErrors = fn => (req,res,next) =>{
  fn(req,res,next).catch(err => res.render(err)) 
}
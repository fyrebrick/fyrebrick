
exports.checkSignIn = (req,res,next)=>{
  if(req.session.logged_in){ 
      next();
  }else{
      res.redirect('/');
  }
};

exports.auth = (req,res,next)=>{
  
  const user = await User.findOne({_id:req.session._id});
  await bricklinkPlus.auth.setup({
    TOKEN_VALUE: user.TOKEN_VALUE,
    TOKEN_SECRET: user.TOKEN_SECRET,
    CONSUMER_KEY: user.CONSUMER_KEY,
    CONSUMER_SECRET: user.CONSUMER_SECRET
  });
  next();
}
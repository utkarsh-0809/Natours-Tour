const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const User=require('../models/userModel');
module.exports= async function isLoggedIn(req,res,next){
    if(req.cookies){
      let token=req.cookies.jwt
   
   try{
   if(!token)
      return 0;

    // validate token
    
    const decode=await promisify(jwt.verify)(token,process.env.JWT_SECRET);


    // check if user still exists

    const newUser=await User.findById(decode.id);

    if(!newUser)
      return 0;
    if(newUser.passwordChangeAfter(decode.iat)){
      return 0;
    }
    return 1;

}
catch(err){
     return next(err)
    }
}
else return 0;
}
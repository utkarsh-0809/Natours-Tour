const User=require('../models/userModel');
const catchAsync=require('../utils/catchAsync');
const jwt=require('jsonwebtoken');
const apiError=require('../utils/apiError');
const {promisify}=require('util');
// const sendEmail = require('../utils/email');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const {Email} =require('../utils/email');


function generateToken(id){
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'365d'})
}

 function sendResponse(user,statusCode,res){
let token= generateToken(user._id);

const cookieOps={
   expires:new Date( Date.now()+ process.env.COOKIE_EXPIRY *24*60*60*1000),
   httpOnly:true
}

 if(process.env.NODE_ENV==='production')
   cookieOps.secure=true

 res.cookie('jwt',token,cookieOps);
 user.password=undefined;

 res.status(statusCode)
 .json({
   status:"success",
   token,
   data:{
      user
   }
 })
}

exports.signUp=catchAsync(async(req,res,next)=>{


   const user=await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm
   })

   const url=`${req.protocol}://127.0.0.1:8000/account`
   await new Email(user,url).sendWelcome()
   sendResponse(user,200,res)
});


exports.login=catchAsync(async(req,res,next)=>{

    const {email,password}=req.body;
    console.log(email);
    // checking user filled both
    if(!email||!password)
      return  next(new apiError('email and password is neccesary',400));

    //checking if input data is correct
    const user=await User.findOne({email}).select('+password');

     if(!user||!await user.checkPassword(password,user.password))
        return next(new apiError('user doesnt exist',401));

     sendResponse(user,200,res)
});

exports.logout=catchAsync(async (req,res,next)=>{
   console.log('hiiii');
   res.cookie('jwt','Tologout',{
      expires:new Date( Date.now()+ 10000),
      httpOnly:true
   });
   console.log(req.cookies);
  res.status(200).json({
   status:"success"
  })
})


exports.checkToken=catchAsync( async(req,res,next)=>{
     
   // check if token exists
   let token;
   //console.log('hiiiii',req.cookies?.jwt)
   if(
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ){
      token=req.headers.authorization.split(' ')[1];
   }
   else if(req.cookies?.jwt){
      token=req.cookies.jwt
   }
   console.log('token ID',token);
   if(!token)
      return next(new apiError('please login to continue',401));

    // validate token
    const decode=await promisify(jwt.verify)(token,process.env.JWT_SECRET);


    // check if user still exists

    const newUser=await User.findById(decode.id);

    if(!newUser)
      return next(new apiError('the user belonging to this id no longer exist',401));

    // check if the password was changed after the token was generated

    if(newUser.passwordChangeAfter(decode.iat)){
      return next(new apiError('User recently change password please login again'));
    }

    req.user=newUser;
    console.log(req.user);

    next();
});


exports.restrict=(...roles)=>{

   return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
         return next(new apiError('you are not authorized to perform this action',404))
      }
     else next();
   }
 }

exports.forgotPassword=catchAsync(async(req,res,next)=>{

   // get and check email

   
   console.log(req.body.email);
   let user=await User.findOne({email:req.body.email});

   if(!user)
      return next(new apiError('there is no user with this email'));


   // updating the resetToken and Time

   const resetToken= user.forgotPasswordToken();

  await  user.save({validateBeforeSave:false});


//   const url=`${req.protocol}://${req.get(
//    'host'
//   )}/api/v1/user/resetPassword/${resetToken}`;

//   const message=`Reset password Link for your natours-app
//   click on link to resetPassword :${url}.\n.
//   this link will expire in ${parseInt((user.passwordResetTime-Date.now())/(60*1000))}`
 
  

  try{
   // await sendEmail({
   //    email:user.email,
   //    subject:'Password Reset Token (validity:10 Mins)',
   //    message:message
   // })

    const url=`${req.protocol}://127.0.0.1/api/v1/user/resetPassword/${resetToken}`;
    await new Email(user,url).resetPassword();
   
   res
   .status(200)
   .json({
      status:"success",
      message:"email sent successfully"
   })
  }
  catch(err){
   user.passwordRestTime=undefined;
   user.passwordResetToken=undefined;

  await user.save({validateBeforeSave:false});

   next(new apiError(err.message,500))
  }
  next();
 
})



exports.resetPassword=catchAsync(async (req,res,next)=>{
   
   let currToken=req.params.token;
   
   // creating the hashtoken form currToken
   let hashedToken=crypto.createHash('sha256')
   .update(currToken)
   .digest('hex');


   let user=await User.findOne({
      passwordResetToken:hashedToken,
      passwordResetTime:{$gt:Date.now()}
   })

   if(!user)
     return next(new apiError('cannot change password!, please try again later'));

   user.password=req.body.password;
   user.passwordConfirm=req.body.passwordConfirm;
   user.passwordResetToken=undefined;
   user.passwordResetTime=undefined;

  await user.save();


//   const token=generateToken(user._id);

//   res.status(200)
//   .json({
//    status:"success",
//    user,
//    token
//   })
sendResponse(user,200,res)

});



exports.updatePassword =catchAsync(async(req,res,next)=>{

   // check if user exists in collection
  // console.log(req.user);
  console.log(req.body);
  console.log(req.user);
   const user=await User.findById(
      // email:req.body.email
      req.user.id  
   ).select('+password')

   // checking password
   //console.log(user);
  

   if(!user||!await user.checkPassword(req.body.password, user.password))
    return  next(new apiError('user id or password is incorrect'));

  
    
  user.password=req.body.newpassword;
   user.passwordConfirm=req.body.passwordConfirm;
   
  await user.save();
  //console.log(user);
 
  const token= generateToken(user._id);
  res.status(200).json({
   status:"success",
   token
  })
})








exports.isLoggedInUi= async(req,res,next)=>{

    if(req.cookies){
      let token=req.cookies.jwt
   
   try{
   if(!token)
      return next();

    // validate token
    const decode=await promisify(jwt.verify)(token,process.env.JWT_SECRET);


    // check if user still exists

    const newUser=await User.findById(decode.id);

    if(!newUser)
      return next();

    // check if the password was changed after the token was generated

    if(newUser.passwordChangeAfter(decode.iat)){
      return next();
    }

    res.locals.user=newUser;
   //  console.log(res.locals.user);

    return next();

   }
   catch(err){
      return next();
   }
   // else {
   //    console.log('cookies is the problem')
   // }
    next();
}
}

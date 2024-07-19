const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const { cosmiconfig } = require('prettier/third-party');
let userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name cannot be empty'],
        maxlength:[100,'please enter a shorter name'],
        // validate:{
        //     validator:validator.isAlpha,
        //     message:'a name must contain only english alphabets'
        // }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:{
            validator:validator.isEmail,
            message:'please insert a correct email'
        }
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:true,
        validate:{
            validator:function(val){
               return val===this.password
            },
            message:"password didn't matched please try again!"
        }
    },
    passwordChangeAt:Date,
    role:{
        type:String,
        enum:['admin','user','tour-guide','lead-guide'],
        default:'user'
    },
    passwordResetToken:String,
    passwordResetTime:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});

userSchema.pre('save',async function(next){
    //if(!this.isModified('password')||!this.isNew) next() ;
if(this.password) this.password=await bcrypt.hash(this.password, 10)
   if(this.passwordConfirm) this.passwordConfirm=undefined;
   
  next();
})

 userSchema.methods.checkPassword=async function (inputPassword,actualPassword){
    return await bcrypt.compare(inputPassword,actualPassword);
 }

 userSchema.methods.passwordChangeAfter=(JwtTokenTime)=>{
    if(this.passwordChangeAt){
        let check=parseInt(this.passwordChangeAt.getTime()/1000,10);
        console.log(check,JwtTokenTime);
        return JwtTokenTime<check;
    }
    return false;
 }

 userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew)
        next() ;

    this.passwordChangeAt=Date.now()-1000;
    next();
 })

 userSchema.methods.forgotPasswordToken=function(){
    let resetToken=crypto.randomBytes(32).toString('hex');

   this.passwordResetToken=crypto.createHash('sha256')
                           .update(resetToken)
                           .digest('hex');

   this.passwordResetTime= Date.now()+ 10*60*1000;
  
   return resetToken;
 }

 userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
 })
let User=mongoose.model('User',userSchema);

module.exports=User;
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const apiError=require('../utils/apiError');
const factory=require('./factoryController');
const multer=require('multer');
const sharp=require('sharp');



// const multerStorage=multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,'public/img/users')
//     },
//     filename:(req,file,callback)=>{
//         const extension=file.mimetype.split('/')[1];
//         callback(null,`user-${req.user.id}-${Date.now()}.${extension}`)
//     }
// })

const multerStorage=multer.memoryStorage();

const multerfilter=(req,file,callback)=>{
    if(file.mimetype.startsWith('image')){
        callback(null,true)
    }
    else{
        func(new(apiError('message',400),false));
    }
}
const upload=multer({
    storage:multerStorage,
    fileFilter:multerfilter
});

exports.resizePhoto=catchAsync(async (req,res,next)=>{
    if(!req.file)
        return next();

    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;

   await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`)

    next();
})



exports.imageUpload=upload.single('photo');
   
// exports. getAllUsers=catchAsync(async(req,res,next)=>{

//    const users=await User.find();
//     res
//     .status(200)
//     .json({
//         Time:req.requestTime,
//         status:"success",
//         users
//     });
// }  )
 
function filterQuery(obj,...fields){
    let newObj={};
    Object.keys(obj).forEach(val=>{
       if(fields.includes(val))
        newObj[val]=obj[val];
    })
    return newObj;
}

exports.getMe=async(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}

exports.updateMe=catchAsync(async(req,res,next)=>{

    if(req.body.password||req.body.passwordConfirm)
        return next(new apiError('cannot update password from this link please follow-/updatePassword'));
    console.log(req.body);
    console.log(req.file);

    const updatedUser=filterQuery(req.body,'name','email');
    if(req.file?.filename) updatedUser.photo=req.file.filename
    const updateUser=await User.findByIdAndUpdate(req.user.id,updatedUser,{
        new:true,
        runValidators:true
    })
    // console.log(updateUser);
    res.status(200)
    .json({
        status:"success",
       user: updateUser
    })
})

exports.deleteMe=catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});

    res.status(204).json({
        status:"success",
        data:null
    })
})


exports.updateRoles=catchAsync(async function (req,res,next){
    
   let users=await User.updateMany({}, { $set: { role: 'user' } });;

   users=await User.findOneAndUpdate(
    {email:'utkarshraghuvanshi743@gmail.com'},
    {role:'admin'},
    {
        new:true,
        runValidators:true
    }
   );

    res.status(200)
    .json({
        status:"sucess",
        users
    })
})



exports.getUser=factory.getModel(User);
exports.getAllUsers=factory.getAllModel(User);
exports.deleteUser=factory.deletModel(User);
exports.updateUser=factory.updateModel(User);
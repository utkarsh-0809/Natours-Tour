const Review = require('../models/reviewModel');
const apiError = require('../utils/apiError');
const catchAsync=require('../utils/catchAsync');
const factory=require('./factoryController');

exports.createIds=catchAsync(async(req,res,next)=>{
    if(!req.body){
        return next(new apiError('please fill all the neccessary info',400))
    }

    if(!req.body.tour)  req.body.tour=req.params.tourId
    if(!req.body.user)  req.body.user=req.user.id
    next();
//    let review=await Review.create(req.body);

//    res.status(200)
//    .json({
//     status:"success",
//     review
//    })
 
})

// exports.getReviews=catchAsync(async(req,res)=>{
//     let filter={}
//     if(req.params.tourId) filter={tour:req.params.tourId}

//     let reviews=await Review.find(filter);

//     res.status(200).json({
//         staus:"success",
//         result:reviews.length,
//         reviews
//     })
// })
exports.checkDuplicate=catchAsync(async(req,res,next)=>{
  let check=Review.find({user:req.user.id,
    tour:req.params.tourId
  })
  if(check)
    return next(new apiError('cannot post multiple reviews on one tour'))

  next();
})

exports.getReview=factory.getModel(Review);
exports.getReviews=factory.getAllModel(Review);
exports.deleteReview=factory.deletModel(Review);
exports.updateReview=factory.updateModel(Review);
exports.createReview=factory.postModel(Review);
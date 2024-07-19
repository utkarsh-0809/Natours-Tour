const mongoose=require('mongoose');
const Tour = require('./tourModel');
const apiError = require('../utils/apiError');

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'a review cannot be empty']
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:5
    },
    createdAt:{
        type:Date,
        defaule:Date.now
    },

    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'a review must belong to a tour']
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'review belongs to a User, please enter Userid']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.index({tour:1,user:1},{unique:true});


reviewSchema.pre(/^find/,async function(next){
    this.populate({
        path: 'user',
        select: 'name'
    })
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // });
    this.select('-__v');
    // this.tour.select('-guides');
    next();
})

reviewSchema.statics.calcAverage=async function(tourId){
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                numRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
        
    ])
    // console.log(stats);
   await Tour.findByIdAndUpdate(stats[0]._id,{
        ratingsAverage:stats[0].avgRating,
        ratingsQuantity:stats[0].numRating
    })
}

  reviewSchema.post('save',function(){
    this.constructor.calcAverage(this.tour)
  })

  reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=await this.findOne();
    next();
  })

  reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calcAverage(this.r.tour)
  })

  

const Review=mongoose.model('review',reviewSchema);

module.exports=Review;
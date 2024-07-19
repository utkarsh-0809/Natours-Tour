const mongoose=require('mongoose');
const slugify=require('slugify');
// const User=require('./userModel');
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'A tour must have a name'],
        trim:true
    },
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficult level']
    },
    ratingsAverage:{
        type:Number,
        default:0,
        max:[5,'maximum rating is 5'],
        min:[0,'minimum rating is 0'],
        set:val=>Math.round(val*10)/10
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                return val<this.price;
            },
            message:"the discount should be less than price"
        }
    },
    summary:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'A cover image in neccessary']
    },
    images:[String],
    createdAt:{
        type:Date,
        default: Date.now(),
        select:false
    },
    startDates:[Date],
    slug:String,
    slug2:String,
    secretTour:{
        type:String,
        default:false
    },
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
tourSchema.index({startLocation:'2dsphere'})
tourSchema.index({price:1})
// tourSchema.index({startLocation:'2dsphere'})

tourSchema.virtual('durationWeeks').get(function(){
    if(!this.maxGroupSize) return ;
    return this.duration/7;
})

tourSchema.virtual('reviews',{
    ref:'review',
    foreignField:'tour',
    localField:'_id'
});

// document middlewares




tourSchema.pre('save',function(next){
    this.slug=slugify(this.name, {lower:true});
    next();
})

// tourSchema.post('save',function(doc,next){
//     // doc.slug2=slugify(this.name, {lower:true});
//     console.log(doc);
//      next();

// });




// query middlewares
tourSchema.pre(/^find/,function(){
    this.find(
        {secretTour:{
        $ne:true
    }
    })
})
tourSchema.pre(/^find/,function(next){
    if(!this.maxGroupSize) next() ;
    this.populate({
        path:'guides',
        select:'-__v -passwordChangeAt'
    })
    next(); 
})



// aggregate middlewares

// tourSchema.pre('aggregate',function(next){
//     // let val=String(this.pipeline()[0][0]);
//     // console.log(val);
//     if(this.pipeline()[0].$geoNear)
//         next();
    
//     this.pipeline().unshift({
        
//             $match:{
//                 secretTour:{$ne:true}
//             }
        
//     })
//     next();
// })
const Tour=mongoose.model('Tour',tourSchema);

module.exports=Tour;

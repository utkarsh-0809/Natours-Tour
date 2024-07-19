

const express=require('express');
const Tour=require('../models/tourModel');
const ApiFeatures=require('../utils/apiFeaturs');
const catchAsync=require('../utils/catchAsync');
const  apiError = require('../utils/apiError');
const factory=require('./factoryController');
const { defaultInvalidHandler } = require('prettier');
const multer=require('multer');
const sharp=require('sharp');


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

exports.uploadTourImages=upload.fields([
    {name:'imageCover',maxCount:1},
    {name:'images',maxCount:3}
])

exports.resizeTourImage=catchAsync(async(req,res,next)=>{
    console.log(req.files)
    if(!req.files?.imageCover||!req.files?.images)
        return next();
    
    req.body.imageCover=`tour-${req.user.id}-${Date.now()}.jpeg`;

   await sharp(req.files.imageCover[0].buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images=[];

  await Promise.all(req.files.images?.map(async (val,i) => {
        const filesname=`tour-${req.user.id}-${i+1}.jpeg`;

   await sharp(val.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/tours/${filesname}`);

    req.body.images.push(filesname)
    }))
    

    next();
})


exports.alias=async (req,res,next)=>{
    req.query.limit=5;
    req.query.sort='-ratingAverage,price';
    req.query.fields='name,price,ratingAverage,duration';

    next();
}
 
// exports. getAllTours=catchAsync( async (req,res,next)=>{
       
//     let features=new ApiFeatures(Tour,req.query)
//     .filter()
//     .sort()
//     .fields()
//     .pagination();
//     let tours=await features.query;

//     res
//     .status(200)
//     .json({
//         Time:req.requestTime,
//         status:"success",
//         result:tours.length,

//         data:{
//             tours
//         }
//     });

// });

// exports. getTour=catchAsync(async (req,res,next)=>{
    
//     let num=req.params.id;
//     console.log(num);
//     let tour= await Tour.findById(num).populate('reviews');

//     if(!tour){
//         return next(new apiError(`no result found for this query`,404));
//     }
//     res
//     .status(200)
//     .json({
//         status:"success",
//         data:{
//             tour
//         }
//     });
    
// })

// exports. postTour=catchAsync( async (req,res,next)=>{
   
    
//     let newTour=await Tour.create(req.body);

//     res
//     .status(200)
//     .json({
//         status:"success",
//         data:{
//             tour:newTour
//         }
//     })
    
  
// })

// exports. updateTour=catchAsync(async (req,res,next)=>{
    
//     let num=req.params.id;
    
//     let newTour= await Tour.findByIdAndUpdate(num,req.body,{
//         new:true,
//         runValidators:true
//     })
//     if(!newTour)
//         return next(new apiError(`no result found for this query`,404));
//     res
//     .status(200)
//     .json({
//         status:"success",
//         data:{
//             newTour
//         }
//     });

// })


exports.getTour=factory.getModel(Tour);
exports.getAllTours=factory.getAllModel(Tour);
exports.updateTour=factory.updateModel(Tour);
exports.deleteTour=factory.deletModel(Tour);
exports.postTour=factory.postModel(Tour);
// exports. deletTour=catchAsync(async (req,res,next)=>{
   
//         let num=(req.params.id);
    
//    let tour=   await Tour.findByIdAndDelete(num);
//    console.log(tour);
//    if(!tour)
//     return next(new apiError(`no result found for this query`,404));
//     res
//     .status(204)
//     .json({
//         status:"success",
//         data:null
//     });
   
// });



exports.getStats=catchAsync(async (req,res,next)=>{
   

        const stats=await Tour.aggregate([
            {
                $match:{
                    ratingsAverage:{$gte:4.5}
                }
            },
            {
                $group:{
                    _id: '$difficulty',
                    numTours:{
                        $sum:1
                    },
                    numRating:{
                        $sum:'$ratingsQuantity'
                    },
                    avgRating:{
                        $avg:'$ratingsAverage'
                    },
                    avgPrice:{
                        $avg:'$price'
                    },
                    minPrice:{
                        $min:'$price'
                    },
                    maxPrice:{
                        $max:'$price'
                    }
                }
            },
            {
                $sort:{
                    avgPrice:1
                }
            }
        ])

        if(!stats)
            return next(new apiError(`no result found for this query`,404));
        res
        .status(200)
        .json({
           status:"success",
           stats
        });
   
})


exports.getMonthly=catchAsync(async (req,res,next)=>{
  
        // console.log(req.params.year);
        const year=req.params.year;
        const month=await Tour.aggregate([
            { // to spread seprately whenever we have multiple values of this
                $unwind: '$startDates'
            },
            {// to get results of only this year
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{ // will group with respect to the month of the start dates
                    _id:{$month:'$startDates'},
                    numTours:{$sum:1},
                    // to get the name of the tour in each group
                    tours:{$push:'$name'}
                }
            },
            {  // this is usend to add the field
                $addFields:{month:'$_id'}
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{ numTours:-1}
            },
            {
                $limit:12
            }
        ])
        if(!month)
            return next(new apiError(`no result found for this query`,404));
        res
    .status(200)
    .json({
        status:"success",
        month
    });
    
})



exports.getTourWithin=catchAsync(async(req,res,next)=>{
    let {distance,latlng,unit}=req.params;
    let [lat,lng]=latlng.split(',');

    console.log(req.params);

    if(!lat||!lng)
    return next(new apiError(
    'please enter latlng correctly with format of lat,lng',400));

    const radius= unit==='mi'?distance/3963.2:distance/6378.1;


    let tour=await Tour.find({
        startLocation:{
            $geoWithin:{
                $centerSphere:[[lng,lat],radius]
            }
        }
    })

    res.status(200)
    .json({
        status:"success",
         results:tour.length,
         tour
    })
})


exports.getDistance=catchAsync(async (req,res,next)=>{
       let [lat,lng]=req.params.latlng.split(',');

       if(!lat||!lng)
        return next(new apiError(
        'please enter latlng correctly with format of lat,lng',400));

       const tours=await Tour.aggregate([
        {
            $geoNear:{
                near:{
                    type:"Point",
                    coordinates:[lng*1,lat*1]
                },
                distanceField:'distance',
                distanceMultiplier:0.001
            }
        },
        {
            $project:{
                distance:1,
                name:1
            }
        }
       ])

       res.status(200)
       .json({
           status:"success",
            tours
       })
})
const catchAsync=require('../utils/catchAsync');
const apiError=require('../utils/apiError');
const ApiFeatures=require('../utils/apiFeaturs');
const Review = require('../models/reviewModel');

exports.deletModel= Model=>

 catchAsync(async (req,res,next)=>{
   
    let num=(req.params.id);

let doc=   await Model.findByIdAndDelete(num);
console.log(doc);
if(!doc)
return next(new apiError(`no result found for this query`,404));
res
.status(204)
.json({
    status:"success",
    data:null
});

});


exports. updateModel=(Model)=>
catchAsync(async (req,res,next)=>{
    
    let num=req.params.id;
    
    let doc= await Model.findByIdAndUpdate(num,req.body,{
        new:true,
        runValidators:true
    })
    if(!doc)
        return next(new apiError(`no result found for this query`,404));
    res
    .status(200)
    .json({
        status:"success",
          data:{
            doc
        }
    });

})


exports. postModel=Model=>
catchAsync( async (req,res,next)=>{
   
    
    let doc=await Model.create(req.body);

    res
    .status(200)
    .json({
        status:"success",
        data:   doc
        
    })
    
  
})


exports.getModel=Model=>
catchAsync(async (req,res,next)=>{
    
    let num=req.params.id;
    console.log(num);
    let doc= await Model.findById(num).populate('reviews');

    if(!doc){
        return next(new apiError(`no result found for this query`,404));
    }
    res
    .status(200)
    .json({
        status:"success",
        data:{
            doc
        }
    });
    
})


exports.getAllModel=Model=>
catchAsync( async (req,res,next)=>{
         let filter={}
    if(req.params.tourId) filter={tour:req.params.tourId}
       
    let features=new ApiFeatures(Model,req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
    let doc=await features.query;

    res
    .status(200)
    .json({
        Time:req.requestTime,
        status:"success",
        result:doc.length,

        data:{
            doc
        }
    });

});

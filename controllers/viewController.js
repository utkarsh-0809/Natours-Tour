const Tour=require('../models/tourModel');
const apiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const User=require('../models/userModel');
const Booking = require('../models/bookingModel');
const isLoggedIn = require('../utils/isLoggedIn');

exports.getOverview=catchAsync(async (req,res,next)=>{
    let tours=await Tour.find();

    if(!tours)
      return next(new apiError('404 page not fount',404))
    res.status(200).render('overview',{
      name:'utkarsh',
      tours,
    })
    // we can directly access tours in overview.pug without accepting
    //  it as a parameter
  })

exports.getTour=catchAsync(async (req,res,next)=>{
  let tour=await Tour.findOne({
    slug:req.params.name
  }).populate({
    path:'reviews',
    fields:'review rating user'
  })

  

  if(!tour)
    return next(new apiError('404 page not fount',404))
   // by giving an error object in next we can pass it to the global error handler
   // which is in app.js
  // this is used to handle errors in a centralized way
  // all other middlewares will be skipped and the error will be passed to the global error handler
  // this error handler is identified by the function having 4 parameters
  // eg. app.use((err, req, res, next)
    res.status(200).render('tour',{
      title:tour.name||'Document',
      tour,
      
    })
  })



  exports.login=catchAsync(async (req,res,next)=>{
    // console.log("hereejeeeeeeeeeeeeeeeeee")
    const check=await isLoggedIn(req,res,next);
    if(check){
      res.status(200).redirect('/account');
      
    }

    res.status(200).render('login')
  })


  exports.account=catchAsync(async (req,res,next)=>{
    res.status(200).render('account');
  })


  exports.myBookings=catchAsync(async (req,res,next)=>{
    const user=req.user;
    const bookings=await Booking.find({
      user
    })
    let tourIds=bookings.map(val=>val.tour);

    let tours=await Tour.find({
      _id:{$in:tourIds }
    })
    // $in will match any of the ids in the tourIds array
    // console.log(tours);
    res.render('overview',{
      tours
    })
  })


  exports.signup=catchAsync(async (req,res,next)=>{
    res.status(200).render('signup');
    // this line is the reason we have to write 
    //app.set('view engine', 'pug');
    // app.set('views', path.join(__dirname, 'views'));

  })
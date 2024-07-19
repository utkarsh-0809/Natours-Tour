const Tour=require('../models/tourModel');
const apiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const User=require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getOverview=catchAsync(async (req,res,next)=>{
    let tours=await Tour.find();

    if(!tours)
      return next(new apiError('404 page not fount',404))
    res.status(200).render('overview',{
      name:'utkarsh',
      tours,
    })
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

    res.status(200).render('tour',{
      title:tour.name||'Document',
      tour,
      
    })
  })


  exports.login=catchAsync(async (req,res,next)=>{
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
    console.log(tours);
    res.render('overview',{
      tours
    })
  })


  exports.signup=catchAsync(async (req,res,next)=>{
    res.status(200).render('signup');
  })
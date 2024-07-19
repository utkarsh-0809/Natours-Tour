
const Tour=require('../models/tourModel');
const ApiFeatures=require('../utils/apiFeaturs');
const catchAsync=require('../utils/catchAsync');
const  apiError = require('../utils/apiError');
const factory=require('./factoryController');
const Booking = require('../models/bookingModel');
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getChekoutSession=catchAsync(async (req,res,next)=>{
    const tour=await Tour.findById(req.params.tourId);
    const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: tour.price*100,
        // recurring: {
        //   interval: 'month',
        // },
        product_data: {
          name: 'Gold Plan',
        },
      });

    const session =await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${
            req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        mode: 'payment',// add by me after exploring documents
        line_items:[
            {
                // name:`${tour.name} Tour`,
                // description:tour.summary,
                // images:[`https://www.natours.dev/img/tours/${tour.imageCover}`],
                // amount:tour.price*100, // it is counted in cents
                // currency:'usd',
                // quantity:1
                price:price.id,
                quantity:1
                

            }
        ]
    })

    res.status(200).json({
        status:"success",
        session
    })
})


exports.createBookings=catchAsync(async(req,res,next)=>{
    if(!req.query) return next();
    const {tour,user,price}=req.query;

    if(!tour||!user||!price)
        return next();

  const booking=  await Booking.create({
        tour,
        user,
        price
    })
    //console.log(booking);
   res.redirect(req.originalUrl.split('?')[0]);
    return next();
})


exports.createNewBooking=factory.postModel(Booking);
exports.getAllBookings=factory.getAllModel(Booking);
exports.getBooking=factory.getModel(Booking);
exports.updateBooking=factory.updateModel(Booking);
exports.deleteBooking=factory.deletModel(Booking);

const express=require('express');
const BookingController=require('../controllers/bookingController');
const auth=require('../controllers/authController');

const router=express.Router();

router.get('/checkout-session/:tourId',
    auth.checkToken,
    BookingController.getChekoutSession);


module.exports=router;